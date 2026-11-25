"""Request/response của API. JSON dùng camelCase để khớp với DTO bên Java."""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    # protected_namespaces=() để dùng được tên field "model_version"
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, protected_namespaces=())


class CvInput(CamelModel):
    text: str = Field(..., min_length=1, description="Toàn văn CV (có thể chứa HTML, sẽ được làm sạch)")
    skills: list[str] = Field(default_factory=list, description="Kỹ năng ứng viên tự khai báo")
    years_of_experience: float | None = Field(None, ge=0, description="Tổng số năm kinh nghiệm")


class JdInput(CamelModel):
    text: str = Field(..., min_length=1, description="Toàn văn JD: tiêu đề, mô tả, yêu cầu")
    required_skills: list[str] = Field(
        default_factory=list,
        description="Kỹ năng bắt buộc; để trống thì tự trích xuất từ text",
    )
    min_years_of_experience: float | None = Field(
        None, ge=0, description="Số năm kinh nghiệm tối thiểu; để trống thì tự đoán từ text"
    )


class CvJdScoreRequest(CamelModel):
    cv: CvInput
    jd: JdInput


class ScoreBreakdown(CamelModel):
    """Điểm từng thành phần, thang 0-100. None nghĩa là không đủ dữ liệu để tính."""

    semantic: float
    skills: float | None
    experience: float | None


class CvJdScoreResponse(CamelModel):
    score: float = Field(..., description="Điểm tổng, thang 0-100")
    breakdown: ScoreBreakdown
    matched_skills: list[str]
    missing_skills: list[str]
    required_years_of_experience: float | None
    explanation: str
    model_version: str
