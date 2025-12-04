import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

print(f"[MongoDB] Connexion à: {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("[MongoDB] ✓ Connecté!")
except Exception as e:
    print(f"[MongoDB] ✗ ERREUR: {e}")
    raise

db = client["eduagent"]

def save_full_history(tutor, status="in_progress"):
    """Créer un nouvel historique dans MongoDB et retourner son ID"""
    try:
        result = db["histories"].insert_one({
            "topic": tutor.topic,
            "plan": tutor.plan,
            "history": tutor.history,
            "status": status,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        print(f"[MongoDB] ✓ History créé: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        print(f"[MongoDB] ✗ Erreur save_history: {e}")
        raise

def update_history(history_id, tutor, status="in_progress"):
    """Mettre à jour un historique existant"""
    try:
        result = db["histories"].update_one(
            {"_id": ObjectId(history_id)},
            {
                "$set": {
                    "plan": tutor.plan,
                    "history": tutor.history,
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        if result.modified_count > 0:
            print(f"[MongoDB] ✓ History mis à jour: {history_id}")
        return result.modified_count
    except Exception as e:
        print(f"[MongoDB] ✗ Erreur update_history: {e}")
        raise

def list_histories(limit=100):
    """Lister tous les historiques"""
    try:
        histories = list(db["histories"].find().sort("updated_at", -1).limit(limit))
        for history in histories:
            history["_id"] = str(history["_id"])
        return histories
    except Exception as e:
        print(f"[MongoDB] ✗ Erreur list_histories: {e}")
        return []

def get_history_by_id(history_id):
    """Récupérer un historique par son ID"""
    try:
        doc = db["histories"].find_one({"_id": ObjectId(history_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
    except Exception as e:
        print(f"[MongoDB] ✗ Erreur get_history: {e}")
        return None

def get_user_by_email(email: str):
    """Récupérer un utilisateur par email"""
    try:
        return db["users"].find_one({"email": email})
    except Exception as e:
        print(f"[MongoDB] ✗ Erreur get_user: {e}")
        return None
