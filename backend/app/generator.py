import json

from pydantic import ValidationError

from .claude_client import ClaudeClient
from .models import GenerateRequest, Scaffold
from .prompts import BASE_RULES, get_prompt
from .store import JobStore

_SCHEMA_HINT = (
    '{"files":[{"path":"string (relative, no ..)","content":"string"}],'
    '"dependencies":["package==version"],"readme":"markdown string"}'
    " — 1 to 8 files, at least one named main.py / cli.py / app.py / pipeline.py."
)


class ScaffoldGenerationError(Exception):
    pass


class JobNotFoundError(Exception):
    pass


def _build_user_prompt(description: str, follow_up: str | None) -> str:
    if follow_up:
        return (
            f"Project description:\n{description}\n\n"
            f"Additional instruction (apply on top of the description):\n{follow_up}"
        )
    return f"Project description:\n{description}"


async def _validate_with_repair(raw: dict, claude: ClaudeClient) -> Scaffold:
    try:
        return Scaffold.model_validate(raw)
    except ValidationError as initial_error:
        repair_input = (
            f"Original output:\n{json.dumps(raw)}\n\nValidation errors:\n{initial_error}"
        )
        try:
            repaired = await claude.repair_json(repair_input, _SCHEMA_HINT)
            return Scaffold.model_validate(repaired)
        except (ValidationError, ValueError) as repair_error:
            raise ScaffoldGenerationError(
                f"scaffold validation failed after repair: {repair_error}"
            ) from repair_error


async def generate(req: GenerateRequest, claude: ClaudeClient) -> Scaffold:
    system = get_prompt(req.app_type)
    user = _build_user_prompt(req.description, req.follow_up)
    try:
        raw = await claude.generate_scaffold(system, user)
    except ValueError as e:
        raise ScaffoldGenerationError(f"model returned unparseable JSON: {e}") from e
    return await _validate_with_repair(raw, claude)


async def refine(
    job_id: str,
    instruction: str,
    store: JobStore,
    claude: ClaudeClient,
) -> Scaffold:
    previous = store.get(job_id)
    if previous is None:
        raise JobNotFoundError(f"job {job_id!r} not found or expired")

    file_tree = "\n".join(f"- {f.path}" for f in previous.files)
    user = (
        f"Previous scaffold file tree:\n{file_tree}\n\n"
        f"Refinement instruction:\n{instruction}\n\n"
        "Return the COMPLETE updated scaffold as JSON — include every file "
        "(modified and unchanged), updated dependencies, and updated README."
    )
    try:
        raw = await claude.generate_scaffold(BASE_RULES, user)
    except ValueError as e:
        raise ScaffoldGenerationError(f"model returned unparseable JSON: {e}") from e
    return await _validate_with_repair(raw, claude)
