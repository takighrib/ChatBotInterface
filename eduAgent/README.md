EduAgent – Agent Backend
========================

AI tutor and media-assistant backend that powers the ChatBotInterface frontend. The agent can run
either as an interactive CLI tutor (`main.py`) or as a FastAPI microservice (`server.py`) that the
React client calls through `/chat/start` and `/chat/message` endpoints.

Features
--------
- Google Gemini powered pedagogy pipeline (planning / teaching / Q&A)
- Automatic visual-aid suggestions with Qdrant vector search
- MongoDB persistence for learning histories (plus JSON backup)
- REST API with CORS enabled to plug into the frontend chatbox
- Docker Compose recipe for MongoDB + Mongo Express + Qdrant

Requirements
------------
- Python 3.12+
- Node/npm only if you plan to run the frontend (not required for the agent itself)
- Docker Desktop (optional, simplifies running MongoDB and Qdrant)

Environment variables
---------------------
Copy `.env.example` to `.env` and fill real secrets.

| Variable           | Purpose                                          | Default                         |
|-------------------|--------------------------------------------------|---------------------------------|
| `GOOGLE_API_KEY`  | Gemini API key for text + image prompts          | _required_                      |
| `MONGO_URI`       | Connection string used by `mongo.py`             | `mongodb://admin:password@...`  |
| `QDRANT_HOST`     | Hostname of the Qdrant instance                   | `localhost`                     |
| `QDRANT_PORT`     | TCP port for Qdrant                               | `6333`                          |
| `QDRANT_COLLECTION` | Vector collection name                         | `image_descriptions`            |

Setup
-----
```powershell
cd agent
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -e .
```

Bring the infrastructure pieces online (optional but recommended):

```powershell
docker compose up -d mongodb mongo-express qdrant
```

Running
-------
CLI tutor:

```powershell
.\.venv\Scripts\activate
python main.py
```

FastAPI service:

```powershell
.\.venv\Scripts\activate
uvicorn server:app --reload --port 8000
```

The API exposes:

- `POST /chat/start` `{ "topic": "transformers" }`
- `POST /chat/message` `{ "sessionId": "...", "message": "next" }`
- `GET /` – health probe
- `GET /docs` – interactive Swagger UI

Project structure
-----------------

```
agent/
├── main.py               # CLI tutor entrypoint
├── server.py             # FastAPI application
├── image_agent.py        # Generates text + image prompts
├── qdrant_utils.py       # Vector DB utilities
├── mongo.py              # Persistence helpers (Mongo + JSON)
├── config.py             # Image metadata and constants
├── docker-compose.yml    # MongoDB, Mongo Express, Qdrant services
├── .env.example          # Environment variable template
└── README.md             # This file
```

Makefile / useful commands
--------------------------

| Command               | Description                       |
|-----------------------|-----------------------------------|
| `make install`        | Install project in editable mode |
| `make api`            | Run FastAPI server               |
| `make cli`            | Launch interactive tutor        |
| `make docker-up`      | Start MongoDB, Mongo Express, Qdrant |
| `make docker-down`    | Stop the containers             |
| `make test`           | Run pytest suite (if present)   |

Feel free to adapt the Makefile or translate the commands into PowerShell scripts if you prefer.
