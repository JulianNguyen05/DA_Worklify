from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/parser", tags=["Parser"])


@router.post("/extract", summary="Phân tích file CV (chưa triển khai)")
def extract_cv() -> None:
    # backend-core (MlCvParsingClient) đã gọi sẵn endpoint này cho chức năng import CV.
    # Trả 501 kèm "detail" để backend-core chuyển nguyên thông báo này cho frontend.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Chức năng phân tích file CV chưa được triển khai.",
    )
