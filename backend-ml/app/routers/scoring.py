from fastapi import APIRouter, Depends, Request

from app.schemas import CvJdBatchRequest, CvJdBatchResponse, CvJdScoreRequest, CvJdScoreResponse
from app.security import verify_internal_api_key

router = APIRouter(prefix="/scoring", tags=["Scoring"], dependencies=[Depends(verify_internal_api_key)])


# Hàm sync (không async) để FastAPI chạy trong threadpool: inference là việc nặng CPU,
# không được chặn event loop.
@router.post("/cv-jd", response_model=CvJdScoreResponse, summary="Chấm điểm mức độ phù hợp giữa CV và JD")
def score_cv_against_jd(payload: CvJdScoreRequest, request: Request) -> CvJdScoreResponse:
    return request.app.state.scorer.score(payload)


@router.post("/cv-jd/batch", response_model=CvJdBatchResponse,
             summary="Chấm nhiều CV với cùng một JD (vd xếp hạng ứng viên của một tin tuyển dụng)")
def score_cvs_against_jd(payload: CvJdBatchRequest, request: Request) -> CvJdBatchResponse:
    return CvJdBatchResponse(results=request.app.state.scorer.score_batch(payload.jd, payload.cvs))
