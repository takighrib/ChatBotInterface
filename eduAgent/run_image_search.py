from qdrant_utils import setup_qdrant, upsert_vectors
from search import find_best_image

if __name__ == "__main__":
    setup_qdrant()
    upsert_vectors()
    topic = "three laws of motion"
    result = find_best_image(topic)
    print(result)