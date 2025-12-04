import os
import numpy as np
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, PointStruct
from config import collection_name as default_collection, images

model = SentenceTransformer("all-mpnet-base-v2")

qdrant_available = True
qdrant_vectors_persisted = False
client = None

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
collection_name = os.getenv("QDRANT_COLLECTION", default_collection)

def setup_qdrant():
    global client, qdrant_available
    try:
        client = QdrantClient(QDRANT_HOST, port=QDRANT_PORT)
        try:
            if hasattr(client, 'collection_exists') and hasattr(client, 'create_collection'):
                if not client.collection_exists(collection_name=collection_name):
                    client.create_collection(
                        collection_name=collection_name,
                        vectors_config={"default": VectorParams(size=768, distance="Cosine")},
                    )
            else:
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config={"default": VectorParams(size=768, distance="Cosine")},
                )
        except Exception as e:
            print("Warning: could not recreate/create collection:", e)
            qdrant_available = False
    except Exception as e:
        print("Warning: could not create/recreate collection (Qdrant may not be running):", e)
        qdrant_available = False

def prepare_points():
    points = []
    for idx, img in enumerate(images):
        vector = model.encode(img["description"])
        try:
            points.append(PointStruct(id=idx, vector=vector.tolist(), payload={"path": img["path"]}))
        except Exception:
            points.append(PointStruct(id=idx, vector=list(map(float, vector.tolist())), payload={"path": img["path"]}))
    return points

def _try_upsert_points(pt_list):
    try:
        client.upsert(collection_name=collection_name, points=pt_list)
        return True, None
    except Exception as err:
        return False, err

def upsert_vectors():
    global qdrant_vectors_persisted, qdrant_available
    if not (qdrant_available and client is not None):
        return
    points = prepare_points()
    try:
        count_result = client.count(collection_name=collection_name)
        if count_result.count > 0:
            qdrant_vectors_persisted = True
            print("Vectors already persisted in Qdrant.")
            return
        # First try using PointStruct objects
        ok, err = _try_upsert_points(points)
        if ok:
            qdrant_vectors_persisted = True
            print("Upserted points to Qdrant.")
        else:
            print("Warning: initial upsert failed:", err)
            # Try fallback using named 'vectors' dict (may fail if client enforces 'vector')
            try:
                fallback_points = []
                for p in points:
                    pid = getattr(p, 'id', None)
                    payload = getattr(p, 'payload', None)
                    vec = getattr(p, 'vector', None)
                    if vec is None and isinstance(p, dict):
                        vec = p.get('vector')
                    if hasattr(vec, 'tolist'):
                        vec_list = vec.tolist()
                    else:
                        vec_list = list(vec) if vec is not None else []
                    fallback_points.append({
                        "id": pid,
                        "vectors": {"default": list(map(float, vec_list))},
                        "payload": payload
                    })
                ok2, err2 = _try_upsert_points(fallback_points)
                if ok2:
                    qdrant_vectors_persisted = True
                    print("Upserted points to Qdrant using fallback 'vectors' dict format.")
                else:
                    # Fallback failed; inspect error to decide next action
                    print("Fallback upsert also failed:", err2)
                    msg = str(err2)
                    # If the client complains about 'points.x.vectors' being extra, it expects top-level 'vector' field
                    if 'points.0.vectors' in msg or 'points.0.vector\n  Field required' in msg or 'Extra inputs are not permitted' in msg:
                        print("Detected client-side validation that forbids 'vectors' and requires top-level 'vector'. Recreating collection with unnamed vector schema and retrying upsert...")
                        try:
                            # Try deleting and recreating collection with unnamed vector schema (legacy format)
                            try:
                                if hasattr(client, 'delete_collection'):
                                    client.delete_collection(collection_name=collection_name)
                            except Exception:
                                pass
                            # Create collection with unnamed VectorParams (not dict)
                            if hasattr(client, 'create_collection'):
                                client.create_collection(collection_name=collection_name, vectors_config=VectorParams(size=768, distance="Cosine"))
                            else:
                                # Fall back to recreate_collection if older client
                                client.recreate_collection(collection_name=collection_name, vectors_config=VectorParams(size=768, distance="Cosine"))
                            # Prepare plain points with top-level 'vector' field
                            plain_points = []
                            for p in points:
                                pid = getattr(p, 'id', None)
                                payload = getattr(p, 'payload', None)
                                vec = getattr(p, 'vector', None)
                                if hasattr(vec, 'tolist'):
                                    vec_list = vec.tolist()
                                else:
                                    vec_list = list(vec) if vec is not None else []
                                plain_points.append({"id": pid, "vector": list(map(float, vec_list)), "payload": payload})
                            ok3, err3 = _try_upsert_points(plain_points)
                            if ok3:
                                qdrant_vectors_persisted = True
                                print("Upserted points using top-level 'vector' after recreating collection with unnamed vectors.")
                            else:
                                print("Retry with plain 'vector' failed:", err3)
                                raw = getattr(err3, 'raw', None) or getattr(err3, 'response', None)
                                if raw is not None:
                                    try:
                                        body = getattr(raw, 'text', None) or getattr(raw, 'content', None) or raw
                                        print("Raw response content:", body)
                                    except Exception:
                                        print("Response present but could not extract body.")
                                qdrant_available = False
                        except Exception as e3:
                            print("Error while recreating collection and retrying upsert:", e3)
                            qdrant_available = False
                    else:
                        # Other unexpected error: print raw response if available and disable Qdrant
                        raw = getattr(err2, 'raw', None) or getattr(err2, 'response', None)
                        if raw is not None:
                            try:
                                body = getattr(raw, 'text', None) or getattr(raw, 'content', None) or raw
                                print("Raw response content:", body)
                            except Exception:
                                print("Response present but could not extract body.")
                        qdrant_available = False
            except Exception as inner_e:
                print("Error during fallback upsert preparation:", inner_e)
                qdrant_available = False
    except Exception as e:
        print("Error checking count:", e)
        qdrant_available = False