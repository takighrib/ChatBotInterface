from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from routes.blog import router as blog_router

from mongo import save_full_history, update_history, list_histories, get_history_by_id
from qdrant_utils import setup_qdrant, upsert_vectors
from main import AITutor
from routes.auth import router as auth_router

app = FastAPI(
    title="EduAgent API",
    description="Endpoints pour le tuteur IA.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router
app.include_router(auth_router, prefix="/auth")
app.include_router(blog_router, prefix="/blog")


# Sessions
sessions: Dict[str, "APIAITutor"] = {}

# Models
class StartRequest(BaseModel):
    topic: str

class MessageRequest(BaseModel):
    message: str
    sessionId: str

class ChatResponse(BaseModel):
    message: str
    sessionId: str
    state: str
    topic: Optional[str] = None
    plan: Optional[List[str]] = None
    segments: Optional[List[Dict[str, Any]]] = None

# Startup
@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("Initializing EduAgent API...")
    print("=" * 50)
    
    try:
        from mongo import client
        client.admin.command('ping')
        print("✓ MongoDB: Connected")
    except Exception as e:
        print(f"✗ MongoDB: Connection failed - {e}")
    
    try:
        setup_qdrant()
        upsert_vectors()
        print("✓ Qdrant: Initialized")
    except Exception as e:
        print(f"✗ Qdrant: Initialization failed - {e}")
    
    print("=" * 50)

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "EduAgent API running"}

# APIAITutor wrapper
class APIAITutor(AITutor):
    def __init__(self):
        super().__init__()
        self.last_response = ""
        self.last_segments = []
        self.history_id = None  # ← NOUVEAU: ID de l'historique dans MongoDB
        self.history_persisted = False

    def save_to_db(self, status="in_progress"):
        """Sauvegarde ou met à jour l'historique dans MongoDB"""
        try:
            if self.history_id is None:
                # Première sauvegarde - créer un nouveau document
                self.history_id = save_full_history(self, status=status)
                print(f"[History] Created with ID: {self.history_id}")
            else:
                # Mise à jour du document existant
                update_history(self.history_id, self, status=status)
                print(f"[History] Updated ID: {self.history_id}")
        except Exception as e:
            print(f"[History] Save failed: {e}")

    def persist_history(self, status="completed"):
        """Sauvegarde finale"""
        if not self.history_persisted:
            try:
                self.save_to_db(status=status)
                self.history_persisted = True
            except Exception as e:
                print(f"Warning: Failed to save history: {e}")

    def generate_plan(self):
        prompt = (
            f"You are an expert AI tutor designed to help beginners. "
            f"Create a simple and structured course plan for the topic: {self.topic}. "
            "The plan should be a list of 4-7 distinct parts or sub-topics "
            "that cover the absolute basics in a logical order. "
            "Return ONLY the list of parts, one per line, numbered."
        )
        response = self.model.generate_content(prompt)
        lines = response.text.strip().split('\n')
        self.plan = [line.strip() for line in lines if line.strip()]
        
        self.current_part_index = 0
        self.state = "TEACHING"
        self.chat = self.model.start_chat(history=[])
        
        # ✅ NOUVEAU: Sauvegarder dès que le plan est créé
        self.save_to_db(status="in_progress")
        
        return self.plan

    def teach_current_part(self):
        if self.current_part_index >= len(self.plan):
            self.state = "FINISHED"
            self.last_response = "Congratulations! You have completed the course."
            self.last_segments = []
            # ✅ Sauvegarder comme terminé
            self.save_to_db(status="completed")
            return

        current_part = self.plan[self.current_part_index]
        
        prompt = (
            f"You are an expert AI tutor teaching {self.topic} to a complete beginner. "
            f"Explain the current part: '{current_part}' in a very simple and clear way. "
            "Use analogies and real-world examples to make concepts easy to understand. "
            "Avoid complex jargon where possible, or explain it simply if necessary. "
            "Keep the tone encouraging and friendly. Focus only on this specific part."
        )
        
        response = self.chat.send_message(prompt)
        self.history.append({"role": "assistant", "message": response.text})
        
        # Process with image agent
        self.last_segments = self.image_agent.process_explanation(response.text)
        
        # Build text response
        text_response = ""
        for segment in self.last_segments:
            if segment['type'] == 'text':
                text_response += segment['content']
        
        self.last_response = text_response
        self.state = "Q_AND_A"
        
        # ✅ NOUVEAU: Sauvegarder après chaque partie
        self.save_to_db(status="in_progress")

    def answer_question(self, question):
        prompt = (
            f"The student, who is a beginner, has a question about the current part: {question}. "
            "Answer the question simply and clearly, using examples if helpful. "
            "Ensure the explanation is easy to grasp for someone with no prior knowledge. "
            "Encourage them to continue learning."
        )
        self.history.append({"role": "user", "message": question})
        response = self.chat.send_message(prompt)
        self.history.append({"role": "assistant", "message": response.text})
        
        self.last_response = response.text
        self.last_segments = [{'type': 'text', 'content': response.text}]
        
        # ✅ NOUVEAU: Sauvegarder après chaque réponse
        self.save_to_db(status="in_progress")

# Routes
@app.post("/chat/start", tags=["Chat"])
async def start_chat(request: StartRequest):
    session_id = str(uuid.uuid4())
    tutor = APIAITutor()
    sessions[session_id] = tutor
    
    tutor.topic = request.topic
    tutor.state = "PLANNING"
    tutor.history.append({"role": "user", "message": request.topic})
    
    tutor.generate_plan()
    tutor.teach_current_part()
    
    return ChatResponse(
        message=tutor.last_response,
        sessionId=session_id,
        state=tutor.state,
        topic=tutor.topic,
        plan=tutor.plan,
        segments=tutor.last_segments
    )

@app.post("/chat/message", tags=["Chat"])
async def send_message(request: MessageRequest):
    if request.sessionId not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    tutor = sessions[request.sessionId]
    user_input = request.message
    
    if user_input.lower() in ["stop", "quit", "exit"]:
        tutor.save_to_db(status="stopped")
        return ChatResponse(
            message="Course stopped.",
            sessionId=request.sessionId,
            state="FINISHED",
            topic=tutor.topic,
            segments=[]
        )
    
    if tutor.state == "Q_AND_A":
        if user_input.lower() in ["next", "continue", "ok", "n"]:
            tutor.current_part_index += 1
            tutor.teach_current_part()
        else:
            tutor.answer_question(user_input)
    
    return ChatResponse(
        message=tutor.last_response,
        sessionId=request.sessionId,
        state=tutor.state,
        topic=tutor.topic,
        segments=tutor.last_segments
    )

@app.get("/chat/history", tags=["History"])
async def get_history_list():
    return list_histories(limit=100)

@app.get("/chat/history/{history_id}", tags=["History"])
async def get_history_entry(history_id: str):
    doc = get_history_by_id(history_id)
    if not doc:
        raise HTTPException(status_code=404, detail="History not found")
    return doc

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
