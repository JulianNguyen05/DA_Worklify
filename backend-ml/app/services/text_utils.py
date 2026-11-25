"""Hàm xử lý văn bản dùng chung: làm sạch HTML, chuẩn hoá tên kỹ năng, tách đoạn."""
from __future__ import annotations

import html
import re

_TAG_RE = re.compile(r"<[^>]+>")
_SPACE_RE = re.compile(r"[ \t\r\f\v]+")
_TOKEN_RE = re.compile(r"[\w+#.]+", re.UNICODE)


def clean_text(text: str) -> str:
    """Bỏ thẻ HTML (mô tả từ TipTap), giải mã &amp;..., gộp khoảng trắng thừa."""
    text = _TAG_RE.sub(" ", text or "")
    text = html.unescape(text)
    lines = [_SPACE_RE.sub(" ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def normalize_skill(name: str) -> str:
    """
    Đưa các cách viết khác nhau của cùng một kỹ năng về một khoá so sánh:
    "ReactJS", "React.js", "react js" -> "react"; "Spring Boot" -> "springboot".
    Giữ lại "+" và "#" để không nhầm C++ / C# với C.
    """
    key = re.sub(r"[\s.\-_/]+", "", (name or "").lower())
    if key.endswith("js") and len(key) - 2 >= 3:
        key = key[:-2]
    return key


def tokenize(text: str) -> list[str]:
    tokens = (t.strip(".").lower() for t in _TOKEN_RE.findall(text or ""))
    return [t for t in tokens if t]


def chunk_text(text: str, max_chars: int = 400) -> list[str]:
    """
    Tách văn bản dài thành các đoạn ngắn để embedding không bị cắt cụt
    (model MiniLM chỉ đọc khoảng 128 token mỗi lần).
    """
    chunks: list[str] = []
    current = ""
    for line in clean_text(text).splitlines():
        if len(current) + len(line) + 1 > max_chars and current:
            chunks.append(current)
            current = ""
        while len(line) > max_chars:
            chunks.append(line[:max_chars])
            line = line[max_chars:]
        current = f"{current}\n{line}" if current else line
    if current:
        chunks.append(current)
    return chunks or [""]
