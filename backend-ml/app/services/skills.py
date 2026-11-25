"""
Danh mục kỹ năng dùng để trích xuất kỹ năng từ JD/CV.

Nguồn: danh sách có sẵn bên dưới + danh mục SKILL chuẩn hoá của backend-core
(/api/internal/reference-values?type=SKILL), được cache trong SKILL_CACHE_TTL_SECONDS.
"""
from __future__ import annotations

import logging
import threading
import time
from collections.abc import Iterable

import httpx

from app.config import Settings
from app.services.text_utils import normalize_skill, tokenize

logger = logging.getLogger("worklify.skills")

DEFAULT_SKILLS = [
    # Ngôn ngữ
    "Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "PHP", "Ruby", "Kotlin", "Swift", "Dart",
    "SQL", "HTML", "CSS",
    # Backend
    "Spring Boot", "Spring Security", "Hibernate", "JPA", "Node.js", "Express", "NestJS", "Django", "Flask",
    "FastAPI", "Laravel", ".NET", "ASP.NET", "RESTful API", "GraphQL", "Microservices",
    # Frontend & mobile
    "React", "Vue", "Angular", "Next.js", "Redux", "TailwindCSS", "Bootstrap", "React Native", "Flutter",
    # Dữ liệu
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "SQL Server", "Elasticsearch",
    # DevOps & công cụ
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Git", "CI/CD", "Jenkins", "Nginx",
    # AI/Data
    "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy",
    # Quy trình
    "Agile", "Scrum", "Unit Test", "JUnit",
]

_MAX_NGRAM = 3


class SkillDictionary:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._lock = threading.Lock()
        self._core_skills: list[str] = []
        self._fetched_at = 0.0

    def _refresh_from_core(self) -> None:
        if not self._settings.core_base_url:
            return
        now = time.monotonic()
        if self._fetched_at and now - self._fetched_at < self._settings.skill_cache_ttl_seconds:
            return
        with self._lock:
            if self._fetched_at and now - self._fetched_at < self._settings.skill_cache_ttl_seconds:
                return
            # Ghi nhận thời điểm thử kể cả khi lỗi, để không gọi lại backend-core ở mọi request.
            self._fetched_at = now
            try:
                resp = httpx.get(
                    f"{self._settings.core_base_url}/api/internal/reference-values",
                    params={"type": "SKILL"},
                    headers={"X-Internal-Api-Key": self._settings.internal_api_key},
                    timeout=3.0,
                )
                resp.raise_for_status()
                items = resp.json().get("data") or []
                self._core_skills = [item["name"] for item in items if item.get("name")]
                logger.info("Đã nạp %d kỹ năng từ backend-core", len(self._core_skills))
            except Exception as exc:
                logger.warning("Không lấy được danh mục kỹ năng từ backend-core (%s), dùng danh sách mặc định", exc)

    def build(self, extra: Iterable[str] = ()) -> dict[str, str]:
        """Trả về map: khoá chuẩn hoá -> tên hiển thị."""
        self._refresh_from_core()
        mapping: dict[str, str] = {}
        for name in [*extra, *self._core_skills, *DEFAULT_SKILLS]:
            key = normalize_skill(name)
            if key and key not in mapping:
                mapping[key] = name.strip()
        return mapping


def find_skills(text: str, dictionary: dict[str, str]) -> list[str]:
    """
    Tìm các kỹ năng trong dictionary xuất hiện trong text, so khớp theo cụm 1-3 từ
    đã chuẩn hoá (nên "Spring Boot", "ReactJS", "Node JS" đều nhận ra được).
    Giữ thứ tự xuất hiện đầu tiên trong text.
    """
    tokens = tokenize(text)
    found: dict[str, str] = {}
    for i in range(len(tokens)):
        for n in range(1, _MAX_NGRAM + 1):
            if i + n > len(tokens):
                break
            key = normalize_skill("".join(tokens[i:i + n]))
            if key in dictionary and key not in found:
                found[key] = dictionary[key]
    return list(found.values())
