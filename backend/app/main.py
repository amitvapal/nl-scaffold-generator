from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()


@app.get("/api/health")
def health():
    return {"status": "ok"}


dist_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if dist_dir.is_dir():
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
else:
    print(f"warning: frontend dist not found at {dist_dir}; skipping static mount (dev mode)")
