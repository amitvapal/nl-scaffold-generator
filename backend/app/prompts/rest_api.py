PROMPT = r"""App type: REST API.

Conventions:
- Framework: FastAPI with Pydantic v2 models.
- Layout: main.py (app + simple routes), models.py (Pydantic schemas). For multi-resource APIs, add routes.py.
- Provide at least one GET endpoint and one POST endpoint.
- Include uvicorn[standard] in dependencies for local serving.

Example output for "A todo API with create and list endpoints":
{"files":[{"path":"main.py","content":"from fastapi import FastAPI\nfrom models import Todo, TodoCreate\n\napp = FastAPI(title=\"Todo API\")\n_todos: list[Todo] = []\n\n@app.get(\"/todos\")\ndef list_todos() -> list[Todo]:\n    return _todos\n\n@app.post(\"/todos\", status_code=201)\ndef create_todo(payload: TodoCreate) -> Todo:\n    todo = Todo(id=len(_todos) + 1, title=payload.title, done=False)\n    _todos.append(todo)\n    return todo\n"},{"path":"models.py","content":"from pydantic import BaseModel, Field\n\nclass TodoCreate(BaseModel):\n    title: str = Field(min_length=1, max_length=200)\n\nclass Todo(BaseModel):\n    id: int\n    title: str\n    done: bool\n"}],"dependencies":["fastapi==0.115.5","uvicorn[standard]==0.32.1","pydantic==2.10.2"],"readme":"# Todo API\n\nMinimal in-memory todo list.\n\n## Quick Start\n\n```bash\npip install -r requirements.txt\nuvicorn main:app --reload\n```\n\nOpen http://localhost:8000/docs for the interactive OpenAPI UI.\n"}
"""
