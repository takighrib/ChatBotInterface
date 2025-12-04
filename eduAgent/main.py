import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
from mongo import save_full_history
from image_agent import ImageAgent
from qdrant_utils import setup_qdrant, upsert_vectors



# Load environment variables
load_dotenv()

class AITutor:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Error: GOOGLE_API_KEY not found in .env file.")
            sys.exit(1)
            
        genai.configure(api_key=api_key)
        # Using a model available in the list: gemini-2.0-flash
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.chat = None
        self.topic = None
        self.plan = []
        self.history = []
        self.current_part_index = 0
        self.state = "IDLE"  # IDLE, PLANNING, TEACHING, Q_AND_A
        self.image_agent = ImageAgent()
    

    def start_course(self, topic):
        self.topic = topic
        self.state = "PLANNING"
        print(f"\nGreat! Let's learn about {self.topic}.\nI am generating a study plan for you...")
        self.generate_plan()
        


    def generate_plan(self):
        prompt = (
            f"You are an expert AI tutor designed to help beginners. Create a simple and structured course plan for the topic: {self.topic}. "
            "The plan should be a list of 4-7 distinct parts or sub-topics that cover the absolute basics in a logical order. "
            "Return ONLY the list of parts, one per line, numbered."
        )
        response = self.model.generate_content(prompt)
        
        # Parse the plan
        lines = response.text.strip().split('\n')
        self.plan = [line.strip() for line in lines if line.strip()]
        
        print("\nHere is the plan:")
        for line in self.plan:
            print(line)
        
        self.current_part_index = 0
        self.state = "TEACHING"
        
        # Start a chat session for the teaching phase to maintain context
        self.chat = self.model.start_chat(history=[])
        
        self.teach_current_part()

    def teach_current_part(self):
        if self.current_part_index >= len(self.plan):
            print("\nCongratulations! You have completed the course.")
            self.state = "FINISHED"
            # save_full_history expects the tutor object (self) so pass it explicitly
            try:
                save_full_history(self, status="completed")
            except Exception as e:
                print(f"Warning: failed to save history: {e}")
            return

        current_part = self.plan[self.current_part_index]
        print(f"\n--- Part {self.current_part_index + 1}: {current_part} ---")
        
        prompt = (
            f"You are an expert AI tutor teaching {self.topic} to a complete beginner. "
            f"Explain the current part: '{current_part}' in a very simple and clear way. "
            "Use analogies and real-world examples to make concepts easy to understand. "
            "Avoid complex jargon where possible, or explain it simply if necessary. "
            "Keep the tone encouraging and friendly. Focus only on this specific part."
        )
        
        response = self.chat.send_message(prompt)
        self.history.append({"role": "assistant", "message": response.text})
        
        # Image Agent processing
        segments = self.image_agent.process_explanation(response.text)
        
        print("\n")
        for segment in segments:
            if segment['type'] == 'text':
                print(segment['content'], end="") 
            elif segment['type'] == 'image':
                print(f"\n\n[Visual Aid] Searching for: {segment['query']}")
                img = segment.get('result')
                if img:
                     print(f"Found: {img.get('path')} (Score: {img.get('score')})\n")
                else:
                     print("No suitable image found.\n")
        print("\n")
        
        self.state = "Q_AND_A"
        print("Do you have any questions about this part? (Type your question, or 'no'/'next' to continue)")

    def handle_user_input(self, user_input):
        if user_input.lower() in ['stop', 'cancel', 'quit', 'exit']:
            print("\nStopping the course. Saving progress...")
            
            # Determine last completed part
            if self.current_part_index > 0:
                status = self.plan[self.current_part_index]
            else:
                status = "Not completed"

            try:
                save_full_history(self, status=status)
            except Exception as e:
                print(f"Warning: failed to save history: {e}")
            
            self.state = "FINISHED"
            return

        if self.state == "Q_AND_A":
            if user_input.lower() in ['no', 'next', 'continue', 'nope', 'n']:
                self.current_part_index += 1
                self.state = "TEACHING"
                self.teach_current_part()
            else:
                # Answer the question
                self.answer_question(user_input)

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
        print(f"\nAI: {response.text}\n")
        print("Do you have any other questions? (Type your question, or 'no'/'next' to continue)")
    
def main():
    tutor = AITutor()
    
    print("Welcome to the AI Tutor!")
    
    # Initialize Qdrant
    print("Initializing Knowledge Base...")
    setup_qdrant()
    upsert_vectors()
    
    while True:
        topic = input("What topic would you like to learn about today? (or type 'exit' to quit) ")
        if topic.lower() in ['stop', 'cancel', 'quit', 'exit']:
            print("Goodbye!")
            return
        if topic.strip():
            break
            
    tutor.start_course(topic)
    
    while tutor.state != "FINISHED":
        user_input = input("> ")
        tutor.handle_user_input(user_input)

if __name__ == "__main__":
    main()

