from pathlib import PurePosixPath
from typing import Literal

from pydantic import BaseModel, Field, field_validator

ENTRYPOINTS = {"main.py", "cli.py", "app.py", "pipeline.py"}
APP_TYPES = ("rest_api", "cli_tool", "dashboard", "chatbot", "data_pipeline")


class FileEntry(BaseModel):
    path: str
    content: str

    @field_validator("path")
    @classmethod
    def safe_path(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("path must not be empty")
        if v.startswith("/"):
            raise ValueError(f"path must be relative, got {v!r}")
        if ".." in PurePosixPath(v).parts:
            raise ValueError(f"path must not contain '..': {v!r}")
        return v


class Scaffold(BaseModel):
    files: list[FileEntry] = Field(min_length=1, max_length=8)
    dependencies: list[str]
    readme: str

    @field_validator("files")
    @classmethod
    def has_entrypoint(cls, v: list[FileEntry]) -> list[FileEntry]:
        basenames = {PurePosixPath(f.path).name for f in v}
        if not (basenames & ENTRYPOINTS):
            raise ValueError(
                f"scaffold must contain at least one entrypoint file ({sorted(ENTRYPOINTS)})"
            )
        return v


class GenerateRequest(BaseModel):
    description: str = Field(min_length=1, max_length=2000)
    app_type: Literal["rest_api", "cli_tool", "dashboard", "chatbot", "data_pipeline"]
    follow_up: str | None = None


class GenerateResponse(BaseModel):
    job_id: str
    files: list[FileEntry]
    dependencies: list[str]
    readme: str


class RefineRequest(BaseModel):
    job_id: str
    instruction: str = Field(min_length=1, max_length=2000)
