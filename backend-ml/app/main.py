import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.routers import agent, parser, scoring
from app.services.cv_advisor import CvAdvisor
from app.services.embedder import create_embedder
from app.services.llm import OllamaClient
from app.services.scorer import CvJdScorer
from app.services.skills import SkillDictionary

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s [%(name)s] %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Nạp model một lần khi khởi động; lần đầu có thể mất vài phút nếu phải tải model từ Hugging Face.
    embedder = create_embedder(settings)
    scorer = CvJdScorer(embedder, SkillDictionary(settings), settings)
    app.state.scorer = scorer
    # Ollama không được gọi lúc khởi động: service vẫn chấm điểm được khi Ollama chưa chạy.
    app.state.cv_advisor = CvAdvisor(scorer, OllamaClient(settings))
    yield


app = FastAPI(
    title="Worklify ML Service",
    description="Dịch vụ AI của Worklify: chấm điểm CV theo JD, agent gợi ý sửa CV, phân tích CV.",
    version="0.2.0",
    lifespan=lifespan,
)

app.include_router(scoring.router)
app.include_router(agent.router)
app.include_router(parser.router)


@app.get("/health", tags=["Health"])
def health() -> dict:
    scorer = getattr(app.state, "scorer", None)
    return {
        "status": "ok",
        "model": scorer.model_version if scorer else None,
        "llm": settings.ollama_model,
    }
