"""
Client LLM cho agent gợi ý sửa CV.

- GeminiClient:   Gemini API (generateContent), chất lượng tốt, trả lời vài giây, cần GEMINI_API_KEY.
- OllamaClient:   LLM chạy trên máy bằng Ollama (https://github.com/ollama/ollama/blob/main/docs/api.md).
- FallbackLlmClient: thử Gemini trước, lỗi / hết lượt miễn phí / mất mạng thì chuyển sang Ollama.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Protocol

import httpx

from app.config import Settings

logger = logging.getLogger("worklify.llm")


class LlmUnavailableError(RuntimeError):
    """LLM không gọi được: chưa chạy, sai/thiếu key, hết lượt, hết thời gian chờ, hoặc trả JSON không đọc được."""


class LlmClient(Protocol):
    # Tên model đã trả lời ở lần gọi gần nhất (FallbackLlmClient đổi theo client thực sự được dùng)
    model: str

    def chat_json(self, system: str, user: str) -> dict:
        """Gửi một lượt hội thoại, yêu cầu LLM trả về đúng một object JSON."""
        ...


def _parse_json_object(content: str, source: str) -> dict:
    text = content.strip()
    # Phòng khi model vẫn bọc JSON trong ```json ... ```
    fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        logger.warning("%s trả về không phải JSON: %s", source, content[:300])
        raise LlmUnavailableError(f"{source} trả về dữ liệu không đúng định dạng") from exc
    if not isinstance(data, dict):
        raise LlmUnavailableError(f"{source} trả về dữ liệu không đúng định dạng")
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

        return _parse_json_object(resp.json().get("message", {}).get("content", ""), "Ollama")


class GeminiClient:
    def __init__(self, settings: Settings):
        if not settings.gemini_api_key:
            raise ValueError("Thiếu GEMINI_API_KEY")
        self._api_key = settings.gemini_api_key
        self._url = f"{settings.gemini_base_url.rstrip('/')}/models/{settings.gemini_model}:generateContent"
        self._timeout = settings.gemini_timeout_seconds
        self.model = settings.gemini_model

    def chat_json(self, system: str, user: str) -> dict:
        payload = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {"responseMimeType": "application/json", "maxOutputTokens": 4096},
        }
        try:
            # API key gửi qua header, không đặt trên URL để khỏi lọt vào log
            resp = httpx.post(self._url, json=payload, timeout=self._timeout,
                              headers={"x-goog-api-key": self._api_key})
        except httpx.HTTPError as exc:
            raise LlmUnavailableError(f"Không kết nối được Gemini API: {exc}") from exc

        if resp.status_code == 429:
            raise LlmUnavailableError("Gemini API báo hết lượt (429), có thể đã vượt giới hạn gói miễn phí")
        if resp.status_code in (400, 401, 403):
            raise LlmUnavailableError(f"Gemini API từ chối yêu cầu ({resp.status_code}), kiểm tra GEMINI_API_KEY "
                                      f"và GEMINI_MODEL: {resp.text[:300]}")
        if resp.status_code >= 400:
            raise LlmUnavailableError(f"Gemini API trả lỗi {resp.status_code}: {resp.text[:300]}")

        candidates = resp.json().get("candidates") or []
        if not candidates:
            raise LlmUnavailableError("Gemini API không trả về nội dung (có thể bị chặn bởi bộ lọc an toàn)")
        parts = candidates[0].get("content", {}).get("parts") or []
        # Bỏ qua phần "suy nghĩ" (thought) nếu model có bật thinking, chỉ ghép phần trả lời
        text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
        if not text.strip():
            reason = candidates[0].get("finishReason", "không rõ")
            raise LlmUnavailableError(f"Gemini API trả về nội dung rỗng (finishReason={reason})")
        return _parse_json_object(text, "Gemini")


class FallbackLlmClient:
    """Dùng primary; khi primary không khả dụng thì dùng fallback cho lượt đó."""

    def __init__(self, primary: LlmClient, fallback: LlmClient):
        self._primary, self._fallback = primary, fallback
        self.model = primary.model

    def chat_json(self, system: str, user: str) -> dict:
        try:
            result = self._primary.chat_json(system, user)
            self.model = self._primary.model
            return result
        except LlmUnavailableError as exc:
            logger.warning("LLM chính (%s) lỗi, chuyển sang %s: %s", self._primary.model, self._fallback.model, exc)
            result = self._fallback.chat_json(system, user)
            self.model = self._fallback.model
            return result


def create_llm_client(settings: Settings) -> LlmClient:
    ollama = OllamaClient(settings)
    if settings.llm_provider == "gemini":
        if not settings.gemini_api_key:
            logger.warning("LLM_PROVIDER=gemini nhưng chưa có GEMINI_API_KEY, dùng Ollama")
            return ollama
        logger.info("Agent dùng Gemini (%s), dự phòng Ollama (%s)", settings.gemini_model, settings.ollama_model)
        return FallbackLlmClient(GeminiClient(settings), ollama)
    logger.info("Agent dùng Ollama (%s)", settings.ollama_model)
    return ollama
