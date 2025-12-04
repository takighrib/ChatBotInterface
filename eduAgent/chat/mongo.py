from pymongo import MongoClient

client = MongoClient("mongodb://admin:password@localhost:27017")
db = client["eduagent"]

def save_full_history(tutor, status="completed"):
    db["histories"].insert_one({
        "topic": tutor.topic,
        "plan": tutor.plan,
        "history": tutor.history,
        "status": status
    })

def list_histories(limit=100):
    return list(db["histories"].find().limit(limit))

def get_history_by_id(history_id):
    from bson import ObjectId
    return db["histories"].find_one({"_id": ObjectId(history_id)})
