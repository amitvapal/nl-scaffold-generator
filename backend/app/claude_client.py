import json
import re
from typing import Any

from anthropic import AsyncAnthropic

_FENCE_RE = re.compile(r"^\s*```(?:json)?\s*\n?(.*?)\n?```\s*$", re.DOTALL)


class ClaudeClient:
    def __init__(self, api_key: str, model: str = "claude-sonnet-4-5") -> None:
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model

    async def generate_scaffold(self, system_prompt: str, user_prompt: str) -> dict[str, Any]:
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=8000,
            temperature=0.2,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = next((b.text for b in response.content if b.type == "text"), "")
        cleaned = self._strip_fences(text)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise ValueError(f"failed to parse JSON from model: {e}\nraw response:\n{text}") from e
        if not isinstance(data, dict):
            raise ValueError(f"expected JSON object, got {type(data).__name__}\nraw:\n{text}")
        return data

    async def repair_json(self, broken_response: str, schema_hint: str) -> dict[str, Any]:
        system = (
            "You repair malformed or schema-violating JSON. "
            "Return ONLY the corrected JSON object. No prose, no markdown fences."
        )
        user = (
            f"Required schema:\n{schema_hint}\n\n"
            f"Broken response:\n{broken_response}\n\n"
            "Return the corrected JSON now."
        )
        return await self.generate_scaffold(system, user)

    @staticmethod
    def _strip_fences(text: str) -> str:
        text = text.strip()
        m = _FENCE_RE.match(text)
        return m.group(1).strip() if m else text
