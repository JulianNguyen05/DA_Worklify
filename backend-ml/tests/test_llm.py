import json
from dataclasses import replace

import httpx
import pytest

from app.config import settings
from app.services import llm
from app.services.llm import (
    FallbackLlmClient,
    GeminiClient,
    LlmUnavailableError,
    OllamaClient,
    create_llm_client,
)

GEMINI_SETTINGS = replace(settings, llm_provider="gemini", gemini_api_key="test-key",
                          gemini_model="gemini-test", gemini_base_url="https://gemini.example/v1beta")


class FakeResponse:
    def __init__(self, status_code=200, body=None):
        self.status_code = status_code
        self._body = body or {}
        self.text = json.dumps(self._body)

    def json(self):
        return self._body


def gemini_body(*parts):
    return {"candidates": [{"content": {"parts": list(parts)}, "finishReason": "STOP"}]}


def test_gemini_request_shape_and_parsing(monkeypatch):
    captured = {}

    def fake_post(url, json=None, timeout=None, headers=None):
        captured.update(url=url, json=json, headers=headers)
        return FakeResponse(200, gemini_body({"text": '{"suggestions": [], "skill_advice": ["a"]}'}))

    monkeypatch.setattr(llm.httpx, "post", fake_post)
    out = GeminiClient(GEMINI_SETTINGS).chat_json("hệ thống", "người dùng")

    assert out == {"suggestions": [], "skill_advice": ["a"]}
    assert captured["url"] == "https://gemini.example/v1beta/models/gemini-test:generateContent"
    assert captured["headers"] == {"x-goog-api-key": "test-key"}  # key không nằm trên URL
    assert captured["json"]["systemInstruction"]["parts"][0]["text"] == "hệ thống"
    assert captured["json"]["contents"][0]["parts"][0]["text"] == "người dùng"
    assert captured["json"]["generationConfig"]["responseMimeType"] == "application/json"


def test_gemini_skips_thought_parts_and_code_fences(monkeypatch):
    body = gemini_body({"text": "đang suy nghĩ...", "thought": True}, {"text": '```json\n{"ok": 1}\n```'})
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(200, body))
    assert GeminiClient(GEMINI_SETTINGS).chat_json("s", "u") == {"ok": 1}


@pytest.mark.parametrize("status,needle", [(429, "hết lượt"), (403, "GEMINI_API_KEY"), (500, "500")])
def test_gemini_http_errors_become_unavailable(monkeypatch, status, needle):
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(status, {"error": "x"}))
    with pytest.raises(LlmUnavailableError, match=needle):
        GeminiClient(GEMINI_SETTINGS).chat_json("s", "u")


def test_gemini_empty_or_blocked_response(monkeypatch):
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(200, {"candidates": []}))
    with pytest.raises(LlmUnavailableError):
        GeminiClient(GEMINI_SETTINGS).chat_json("s", "u")


def test_gemini_network_error(monkeypatch):
    def boom(*a, **k):
        raise httpx.ConnectError("không có mạng")

    monkeypatch.setattr(llm.httpx, "post", boom)
    with pytest.raises(LlmUnavailableError, match="Không kết nối"):
        GeminiClient(GEMINI_SETTINGS).chat_json("s", "u")


class StubLlm:
    def __init__(self, model, result=None, error=None):
        self.model, self.result, self.error, self.calls = model, result, error, 0

    def chat_json(self, system, user):
        self.calls += 1
        if self.error:
            raise self.error
        return self.result


def test_fallback_uses_secondary_when_primary_fails():
    primary = StubLlm("gemini", error=LlmUnavailableError("429"))
    secondary = StubLlm("qwen", result={"from": "ollama"})
    client = FallbackLlmClient(primary, secondary)

    assert client.chat_json("s", "u") == {"from": "ollama"}
    assert client.model == "qwen"  # báo đúng model đã thực sự trả lời


def test_fallback_prefers_primary():
    client = FallbackLlmClient(StubLlm("gemini", result={"from": "gemini"}), StubLlm("qwen", result={}))
    assert client.chat_json("s", "u") == {"from": "gemini"}
    assert client.model == "gemini"


def test_factory_selects_provider():
    assert isinstance(create_llm_client(GEMINI_SETTINGS), FallbackLlmClient)
    assert isinstance(create_llm_client(replace(GEMINI_SETTINGS, gemini_api_key="")), OllamaClient)
    assert isinstance(create_llm_client(replace(GEMINI_SETTINGS, llm_provider="ollama")), OllamaClient)
