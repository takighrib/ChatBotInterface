import qdrant_utils

def find_best_image(explanation):
    qvec = qdrant_utils.model.encode(explanation)
    
    # Check if Qdrant is available, but don't crash if it's not. Just return None.
    if not (qdrant_utils.qdrant_available and qdrant_utils.client is not None and qdrant_utils.qdrant_vectors_persisted):
        print("Warning: Qdrant is not ready. Skipping image search.")
        return None

    try:
        if hasattr(qdrant_utils.client, 'query_points'):
            res = qdrant_utils.client.query_points(collection_name=qdrant_utils.collection_name, query=qvec.tolist(), limit=1, with_payload=True)
            if res:
                hits = getattr(res, 'points', getattr(res, 'result', res))
                if hits:
                    try:
                        return {'path': hits[0].payload.get("path"), 'score': getattr(hits[0], 'score', None)}
                    except Exception:
                        return None
        if hasattr(qdrant_utils.client, 'search'):
            res = qdrant_utils.client.search(collection_name=qdrant_utils.collection_name, query_vector=qvec.tolist(), limit=1)
            if res:
                hits = getattr(res, 'points', getattr(res, 'result', res))
                if hits:
                    try:
                        return {'path': hits[0].payload.get("path"), 'score': getattr(hits[0], 'score', None)}
                    except Exception:
                        return None
        elif hasattr(qdrant_utils.client, 'search_points'):
            res = qdrant_utils.client.search_points(collection_name=qdrant_utils.collection_name, query_vector=qvec.tolist(), limit=1)
            if res:
                hits = getattr(res, 'points', getattr(res, 'result', res))
                if hits:
                    try:
                        return {'path': hits[0].payload.get("path"), 'score': getattr(hits[0], 'score', None)}
                    except Exception:
                        return None
    except Exception as e:
        print(f"Qdrant search failed: {e}")
        return None