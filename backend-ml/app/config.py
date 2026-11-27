"""Cấu hình đọc từ biến môi trường (có giá trị mặc định cho môi trường dev)."""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _env_float(name: str, default: float) -> float:
    return float(os.getenv(name, str(default)))


def _env_bool(name: str, default: bool) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    # "sentence-transformers" (mặc định) hoặc "bow" (bag-of-words, không cần torch — dùng khi dev/test nhanh).
    embedding_backend: str = os.getenv("EMBEDDING_BACKEND", "sentence-transformers")

    # Nếu thư mục này tồn tại (model đã fine-tune trên Colab), dùng nó; nếu không thì tải MODEL_NAME.
    model_path: str = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "cv-jd-scorer"))
    model_name: str = os.getenv("MODEL_NAME", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

    # Cosine similarity thô của embedding hiếm khi gần 0 hoặc 1, nên được kéo giãn
    # tuyến tính từ [LOW, HIGH] về [0, 1]. Sau khi fine-tune cần đo lại 2 ngưỡng này.
    semantic_sim_low: float = _env_float("SEMANTIC_SIM_LOW", 0.15)
    semantic_sim_high: float = _env_float("SEMANTIC_SIM_HIGH", 0.75)

    # Trọng số các thành phần điểm. Thành phần nào không tính được (vd JD không nêu số năm
    # kinh nghiệm) sẽ bị bỏ qua và các trọng số còn lại được chuẩn hoá lại.
    weight_semantic: float = _env_float("WEIGHT_SEMANTIC", 0.45)
    weight_skills: float = _env_float("WEIGHT_SKILLS", 0.40)
    weight_experience: float = _env_float("WEIGHT_EXPERIENCE", 0.15)

    # backend-core: lấy danh mục kỹ năng chuẩn hoá qua /api/internal/reference-values.
    # Để trống CORE_BASE_URL nếu muốn chỉ dùng danh sách kỹ năng có sẵn.
    core_base_url: str = os.getenv("CORE_BASE_URL", "http://localhost:8080")
    internal_api_key: str = os.getenv("INTERNAL_API_KEY", "local-dev-only-change-me")
    skill_cache_ttl_seconds: int = int(os.getenv("SKILL_CACHE_TTL_SECONDS", "600"))

    # Bắt buộc header X-Internal-Api-Key cho các endpoint chấm điểm (chỉ backend-core được gọi).
    require_api_key: bool = _env_bool("REQUIRE_API_KEY", True)

    # LLM chạy bằng Ollama, dùng cho agent gợi ý sửa CV (/agent/cv-advice).
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
    # Chạy bằng CPU nên một lượt sinh có thể mất 1-2 phút.
    ollama_timeout_seconds: float = _env_float("OLLAMA_TIMEOUT_SECONDS", 240)


settings = Settings()
