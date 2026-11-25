"""
Tính độ tương đồng ngữ nghĩa giữa CV và JD.

- SentenceTransformerEmbedder: dùng model đã fine-tune trên Colab (nếu có trong
  MODEL_PATH) hoặc model đa ngôn ngữ có sẵn (MODEL_NAME).
- BagOfWordsEmbedder: phương án dự phòng không cần torch, dùng khi dev/test
  hoặc khi không tải được model.
"""
from __future__ import annotations

import logging
import math
from collections import Counter
from pathlib import Path
from typing import Protocol

from app.config import Settings
from app.services.text_utils import chunk_text, tokenize

logger = logging.getLogger("worklify.embedder")


class Embedder(Protocol):
    name: str

    def similarity(self, text_a: str, text_b: str) -> float:
        """Cosine similarity trong khoảng [-1, 1]."""
        ...


class BagOfWordsEmbedder:
    name = "bow-fallback"

    def similarity(self, text_a: str, text_b: str) -> float:
        a, b = Counter(tokenize(text_a)), Counter(tokenize(text_b))
        if not a or not b:
            return 0.0
        dot = sum(a[t] * b[t] for t in a.keys() & b.keys())
        norm = math.sqrt(sum(v * v for v in a.values())) * math.sqrt(sum(v * v for v in b.values()))
        return dot / norm if norm else 0.0


class SentenceTransformerEmbedder:
    def __init__(self, model_ref: str, name: str):
        from sentence_transformers import SentenceTransformer  # import muộn: chỉ cần khi dùng backend này

        self._model = SentenceTransformer(model_ref, device="cpu")
        self.name = name

    def _embed(self, text: str):
        # Embed từng đoạn rồi lấy trung bình, để CV/JD dài không bị cắt mất phần sau.
        vectors = self._model.encode(chunk_text(text), normalize_embeddings=True)
        mean = vectors.mean(axis=0)
        norm = float((mean ** 2).sum() ** 0.5)
        return mean / norm if norm else mean

    def similarity(self, text_a: str, text_b: str) -> float:
        return float((self._embed(text_a) * self._embed(text_b)).sum())


def create_embedder(settings: Settings) -> Embedder:
    if settings.embedding_backend == "bow":
        logger.info("Dùng embedder bag-of-words (EMBEDDING_BACKEND=bow)")
        return BagOfWordsEmbedder()

    local_model = Path(settings.model_path)
    if local_model.is_dir() and any(local_model.iterdir()):
        model_ref, name = str(local_model), f"local:{local_model.name}"
    else:
        model_ref, name = settings.model_name, f"pretrained:{settings.model_name.split('/')[-1]}"

    try:
        logger.info("Đang tải model embedding: %s", model_ref)
        embedder = SentenceTransformerEmbedder(model_ref, name)
        logger.info("Đã tải xong model embedding: %s", name)
        return embedder
    except Exception:  # thiếu thư viện, không có mạng, model hỏng...
        logger.exception("Không tải được model %s, chuyển sang bag-of-words", model_ref)
        return BagOfWordsEmbedder()
