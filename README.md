# Natural Language App Scaffold Generator

> Describe an app in plain English. Get a runnable Python project scaffold (file tree, code, dependencies, README) downloadable as a zip in under 10 seconds.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://nl-scaffold-generator.onrender.com)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)

## What it does

You type something like *"a FastAPI app that fetches weather data from OpenWeather and caches it in Redis, with a /forecast endpoint that takes a city name."*

In ~10 seconds you get back:

- A complete file tree preview in the browser
- The actual code for each file
- A `requirements.txt` with the right deps pinned
- A `README.md` explaining how to run it
- All zipped, one click to download

App setup time goes from "spend an hour on boilerplate" to "ten seconds describing what you want."

## Live demo

[https://nl-scaffold-generator.onrender.com](https://nl-scaffold-generator.onrender.com)

Note: hosted on Render's free tier, so the first request after idle takes ~30 seconds while the container wakes up.

## Features

- **5 supported app types**: REST API, CLI tool, dashboard (Streamlit), chatbot, data pipeline. Each has a hand-tuned prompt template that knows what's idiomatic for that type.
- **Iterative refinement**: preview the file tree, send a follow-up prompt to adjust ("add JWT auth", "swap SQLite for Postgres"), regenerate without starting over.
- **Pydantic-validated output**: Claude returns JSON validated against a schema before we trust it. If validation fails, one repair retry. Malformed scaffolds never reach the user.
- **One-click zip download**: in-memory zip generation, no temp files on disk.
- **Single container**: FastAPI serves the React build alongside the API. One service, one URL.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Backend | FastAPI (Python 3.11) | Async, type-hinted, native OpenAPI docs |
| LLM | Claude API (`claude-sonnet-4-5`) | Best code-generation quality |
| Validation | Pydantic v2 | Schema enforcement on every LLM response |
| Frontend | React 18 + Vite + Tailwind | Fast dev loop, clean UI without writing CSS |
| Packaging | Python `zipfile` (stdlib) | No extra deps, in-memory streaming |
| Deploy | Single Docker image on Render | One service serves both UI and API |

## Architecture

```
┌──────────────┐       ┌─────────────────────────┐       ┌──────────────┐
│              │       │   FastAPI (Render)      │       │              │
│   Browser    │◀─────▶│   /         → React UI  │──────▶│  Claude API  │
│              │       │   /api/*    → JSON      │◀──────│              │
└──────────────┘       │   /download → zip       │       └──────────────┘
                       └─────────────────────────┘
```

Request flow:
1. User types a description, picks an app type, hits Generate.
2. Frontend POSTs to `/api/generate` with `{ description, app_type, follow_up?: string }`.
3. Backend selects the prompt template, calls Claude with structured-output instructions.
4. Claude returns JSON: `{ files: [{ path, content }], dependencies: [...], readme: "..." }`.
5. Backend validates against Pydantic. If validation fails, one repair-prompt retry.
6. Frontend renders the file tree. User clicks Download. Backend streams a zip from memory.

## Quick start

### Run with Docker (recommended)
```bash
git clone https://github.com/amitva/nl-scaffold-generator.git
cd nl-scaffold-generator
cp .env.example .env
# edit .env and paste your ANTHROPIC_API_KEY
docker build -t scaffold-gen .
docker run -p 8000:8000 --env-file .env scaffold-gen
# open http://localhost:8000
```

### Run without Docker
```bash
# build the frontend once
cd frontend && npm install && npm run build && cd ..

# run the backend (which serves the built frontend)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
uvicorn app.main:app --reload
# open http://localhost:8000
```

## API

### `POST /api/generate`
```json
{
  "description": "A FastAPI app for tracking books I want to read",
  "app_type": "rest_api"
}
```

Response:
```json
{
  "job_id": "a3f1b2c4",
  "files": [
    { "path": "main.py", "content": "from fastapi import FastAPI..." },
    { "path": "models.py", "content": "..." }
  ],
  "dependencies": ["fastapi==0.115.0", "uvicorn==0.30.0"],
  "readme": "# Reading List API\n..."
}
```

### `GET /api/download/{job_id}`
Returns the scaffold as a zip. Job IDs cached in memory for 10 minutes.

### `POST /api/refine`
```json
{ "job_id": "a3f1b2c4", "instruction": "Add JWT authentication" }
```

## Project structure

```
nl-scaffold-generator/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, routes, static serving
│   │   ├── claude_client.py     # Anthropic SDK wrapper
│   │   ├── generator.py         # description → JSON → validated Scaffold
│   │   ├── zipper.py            # in-memory zip builder
│   │   ├── models.py            # Pydantic schemas
│   │   ├── store.py             # in-memory job cache (TTL 10 min)
│   │   └── prompts/             # 5 app-type prompt templates
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/          # PromptInput, FileTree, Viewer, Download, Refine
│   └── package.json
├── Dockerfile                   # multi-stage: build frontend, copy into backend image
├── .env.example
└── README.md
```

## Prompt design

Each app type has a tailored system prompt that:

- Specifies the conventional file layout for that type (e.g., `cli_tool` uses Click and a `cli.py` entrypoint; `dashboard` uses Streamlit with `app.py`).
- Provides a short few-shot example of well-formed output.
- Enforces a strict JSON schema so Pydantic parsing succeeds on the first try.
- Bounds scope: max 8 files, max 200 lines per file. Keeps generation fast and outputs reviewable.

I iterated across multiple rounds, testing each app type with three different descriptions and tracking valid-JSON rate, runnability, and idiomatic-pattern rate. The Pydantic-as-contract pattern was the unlock for reliability.

## Limitations

- Generated scaffolds are starting points, not finished apps. They run; they don't have tests, auth, or production hardening unless you ask for those in the description.
- Job cache is in-memory, so a restart loses pending downloads. Fine for a hobby tool; for production swap in Redis.
- Python-only. JS/TS/Go are obvious next targets.
- No rate limiting yet. Add slowapi if traffic shows up.

## What's next

- Stream Claude's response so the file tree appears file-by-file.
- Diff view on refinements.
- Persisted history of past scaffolds.
- TypeScript/Node scaffolds.

## License

MIT

## Author

Amitva Pal — [GitHub](https://github.com/amitva) · [LinkedIn](https://linkedin.com/in/amitva)
