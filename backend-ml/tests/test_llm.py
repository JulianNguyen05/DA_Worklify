import json
from dataclasses import replace

import httpx
import pytest

from app.config import settings
from app.services import llm
from app.services.llm import LlmUnavailableError, OllamaClient

OLLAMA_SETTINGS = replace(settings, ollama_base_url="http://ollama.test:11434", ollama_model="qwen-test")


class FakeResponse:
    def __init__(self, status_code=200, body=None):
        self.status_code = status_code
        self._body = body or {}
        self.text = json.dumps(self._body)

    def json(self):
        return self._body


def test_ollama_request_shape_and_parsing(monkeypatch):
    captured = {}

    def fake_post(url, json=None, timeout=None):
        captured.update(url=url, json=json)
        return FakeResponse(200, {"message": {"content": '{"suggestions": [], "skill_advice": ["a"]}'}})

    monkeypatch.setattr(llm.httpx, "post", fake_post)
    out = OllamaClient(OLLAMA_SETTINGS).chat_json("hệ thống", "người dùng")

    assert out == {"suggestions": [], "skill_advice": ["a"]}
    assert captured["url"] == "http://ollama.test:11434/api/chat"
    assert captured["json"]["model"] == "qwen-test"
    assert captured["json"]["format"] == "json"
    assert [m["role"] for m in captured["json"]["messages"]] == ["system", "user"]


def test_ollama_tolerates_code_fences(monkeypatch):
    body = {"message": {"content": '```json\n{"ok": 1}\n```'}}
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(200, body))
    assert OllamaClient(OLLAMA_SETTINGS).chat_json("s", "u") == {"ok": 1}


@pytest.mark.parametrize("status,needle", [(404, "ollama pull qwen-test"), (500, "500")])
def test_ollama_http_errors_become_unavailable(monkeypatch, status, needle):
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(status, {"error": "x"}))
    with pytest.raises(LlmUnavailableError, match=needle):
        OllamaClient(OLLAMA_SETTINGS).chat_json("s", "u")


def test_ollama_invalid_json(monkeypatch):
    monkeypatch.setattr(llm.httpx, "post", lambda *a, **k: FakeResponse(200, {"message": {"content": "không phải JSON"}}))
    with pytest.raises(LlmUnavailableError, match="không đúng định dạng"):
        OllamaClient(OLLAMA_SETTINGS).chat_json("s", "u")


def test_ollama_not_running(monkeypatch):
    def boom(*a, **k):
        raise httpx.ConnectError("connection refused")

    monkeypatch.setattr(llm.httpx, "post", boom)
    with pytest.raises(LlmUnavailableError, match="Không kết nối được Ollama"):
        OllamaClient(OLLAMA_SETTINGS).chat_json("s", "u")
