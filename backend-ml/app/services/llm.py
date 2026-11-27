"""Gọi LLM chạy trên máy bằng Ollama (https://github.com/ollama/ollama/blob/main/docs/api.md)."""
from __future__ import annotations

import json
import logging
import re
from typing import Protocol

import httpx

from app.config import Settings

logger = logging.getLogger("worklify.llm")


class LlmUnavailableError(RuntimeError):
    """Ollama không chạy, chưa tải model, hết thời gian chờ, hoặc trả về JSON không đọc được."""


class LlmClient(Protocol):
    model: str

    def chat_json(self, system: str, user: str) -> dict:
        """Gửi một lượt hội thoại, yêu cầu LLM trả về đúng một object JSON."""
        ...


def _parse_json_object(content: str) -> dict:
    text = content.strip()
    # Phòng khi model vẫn bọc JSON trong ```json ... ```
    fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        logger.warning("LLM trả về không phải JSON: %s", content[:300])
        raise LlmUnavailableError("LLM trả về dữ liệu không đúng định dạng") from exc
    if not isinstance(data, dict):
        raise LlmUnavailableError("LLM trả về dữ liệu không đúng định dạng")
    return data


class OllamaClient:
    def __init__(self, settings: Settings):
        self._base_url = settings.ollama_base_url.rstrip("/")
        self._timeout = settings.ollama_timeout_seconds
        self.model = settings.ollama_model

    def chat_json(self, system: str, user: str) -> dict:
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "format": "json",  # Ollama ép đầu ra là JSON hợp lệ
            "stream": False,
            "options": {"temperature": 0.3, "num_ctx": 4096, "num_predict": 1200},
        }
        try:
            resp = httpx.post(f"{self._base_url}/api/chat", json=payload, timeout=self._timeout)
        except httpx.HTTPError as exc:
            raise LlmUnavailableError(f"Không kết nối được Ollama tại {self._base_url}: {exc}") from exc

        if resp.status_code == 404:
            raise LlmUnavailableError(
                f"Ollama chưa có model {self.model}. Chạy: ollama pull {self.model}")
        if resp.status_code >= 400:
            raise LlmUnavailableError(f"Ollama trả lỗi {resp.status_code}: {resp.text[:300]}")

        return _parse_json_object(resp.json().get("message", {}).get("content", ""))
