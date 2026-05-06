import logging
import os
import secrets
import time
from io import BytesIO
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

from .claude_client import ClaudeClient
from .generator import (
    JobNotFoundError,
    ScaffoldGenerationError,
    generate,
    refine,
)
from .models import GenerateRequest, GenerateResponse, RefineRequest
from .store import JobStore
from .zipper import build_zip

load_dotenv()

log = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

app = FastAPI(title="nl-scaffold-generator")


@app.on_event("startup")
def _startup() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        log.warning("ANTHROPIC_API_KEY is not set — /api/generate will fail")
    app.state.claude = ClaudeClient(api_key=api_key)
    app.state.store = JobStore()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate", response_model=GenerateResponse)
async def api_generate(req: GenerateRequest, request: Request) -> GenerateResponse:
    start = time.perf_counter()
    try:
        scaffold = await generate(req, request.app.state.claude)
    except ScaffoldGenerationError as e:
        log.exception("generate failed app_type=%s desc_len=%d", req.app_type, len(req.description))
        raise HTTPException(status_code=502, detail=str(e)) from e

    job_id = secrets.token_hex(4)
    request.app.state.store.put(job_id, scaffold)
    log.info(
        "generate ok job_id=%s app_type=%s desc_len=%d latency_ms=%.0f",
        job_id,
        req.app_type,
        len(req.description),
        (time.perf_counter() - start) * 1000,
    )
    return GenerateResponse(job_id=job_id, **scaffold.model_dump())


@app.post("/api/refine", response_model=GenerateResponse)
async def api_refine(req: RefineRequest, request: Request) -> GenerateResponse:
    start = time.perf_counter()
    store: JobStore = request.app.state.store
    try:
        scaffold = await refine(req.job_id, req.instruction, store, request.app.state.claude)
    except JobNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ScaffoldGenerationError as e:
        log.exception("refine failed prev_job=%s instr_len=%d", req.job_id, len(req.instruction))
        raise HTTPException(status_code=502, detail=str(e)) from e

    new_job_id = secrets.token_hex(4)
    store.put(new_job_id, scaffold)
    log.info(
        "refine ok prev_job=%s new_job=%s instr_len=%d latency_ms=%.0f",
        req.job_id,
        new_job_id,
        len(req.instruction),
        (time.perf_counter() - start) * 1000,
    )
    return GenerateResponse(job_id=new_job_id, **scaffold.model_dump())


@app.get("/api/download/{job_id}")
def api_download(job_id: str, request: Request) -> StreamingResponse:
    scaffold = request.app.state.store.get(job_id)
    if scaffold is None:
        raise HTTPException(status_code=404, detail=f"job {job_id} not found or expired")
    data = build_zip(scaffold)
    return StreamingResponse(
        BytesIO(data),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={job_id}.zip"},
    )


dist_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if dist_dir.is_dir():
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
else:
    print(f"warning: frontend dist not found at {dist_dir}; skipping static mount (dev mode)")
