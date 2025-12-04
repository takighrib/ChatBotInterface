from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=3000)
    client.admin.command('ping')
    print("✓ MongoDB fonctionne!")
    
    # Test d'insertion
    db = client["eduagent"]
    result = db["test"].insert_one({"message": "hello"})
    print(f"✓ Insert OK: {result.inserted_id}")
    
    # Test de lecture
    doc = db["test"].find_one({"message": "hello"})
    print(f"✓ Read OK: {doc}")
    
except Exception as e:
    print(f"✗ Erreur: {e}")