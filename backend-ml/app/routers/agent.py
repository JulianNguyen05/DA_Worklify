import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.schemas import CvAdviceRequest, CvAdviceResponse
from app.security import verify_internal_api_key
from app.services.llm import LlmUnavailableError

logger = logging.getLogger("worklify.agent")

router = APIRouter(prefix="/agent", tags=["Agent"], dependencies=[Depends(verify_internal_api_key)])


@router.post("/cv-advice", response_model=CvAdviceResponse,
             summary="Agent gợi ý viết lại CV cho sát JD (đánh giá → LLM đề xuất → chấm lại để kiểm chứng)")
def advise_cv(payload: CvAdviceRequest, request: Request) -> CvAdviceResponse:
    try:
        return request.app.state.cv_advisor.advise(payload)
    except LlmUnavailableError as exc:
        logger.warning("LLM không khả dụng: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
