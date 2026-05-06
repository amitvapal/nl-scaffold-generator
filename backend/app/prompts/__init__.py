from .base import BASE_RULES
from .chatbot import PROMPT as _CHATBOT
from .cli_tool import PROMPT as _CLI_TOOL
from .dashboard import PROMPT as _DASHBOARD
from .data_pipeline import PROMPT as _DATA_PIPELINE
from .rest_api import PROMPT as _REST_API

_PROMPTS: dict[str, str] = {
    "rest_api": _REST_API,
    "cli_tool": _CLI_TOOL,
    "dashboard": _DASHBOARD,
    "chatbot": _CHATBOT,
    "data_pipeline": _DATA_PIPELINE,
}


def get_prompt(app_type: str) -> str:
    if app_type not in _PROMPTS:
        raise KeyError(f"unknown app_type: {app_type!r}")
    return BASE_RULES + "\n\n" + _PROMPTS[app_type]


__all__ = ["BASE_RULES", "get_prompt"]
