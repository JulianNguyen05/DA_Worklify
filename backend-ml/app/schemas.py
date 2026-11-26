"""Request/response của API. JSON dùng camelCase để khớp với DTO bên Java."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    # protected_namespaces=() để dùng được tên field "model_version"
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, protected_namespaces=())


def _none_to_empty_list(value):
    # Client Java (Jackson) có thể gửi "skills": null thay vì bỏ trường — coi như danh sách rỗng.
    return [] if value is None else value


class CvInput(CamelModel):
    text: str = Field(..., min_length=1, description="Toàn văn CV (có thể chứa HTML, sẽ được làm sạch)")
    skills: list[str] = Field(default_factory=list, description="Kỹ năng ứng viên tự khai báo")
    years_of_experience: float | None = Field(None, ge=0, description="Tổng số năm kinh nghiệm")

    _skills_none = field_validator("skills", mode="before")(_none_to_empty_list)


class JdInput(CamelModel):
    text: str = Field(..., min_length=1, description="Toàn văn JD: tiêu đề, mô tả, yêu cầu")
    required_skills: list[str] = Field(
        default_factory=list,
        description="Kỹ năng bắt buộc; để trống thì tự trích xuất từ text",
    )
    min_years_of_experience: float | None = Field(
        None, ge=0, description="Số năm kinh nghiệm tối thiểu; để trống thì tự đoán từ text"
    )

    _required_skills_none = field_validator("required_skills", mode="before")(_none_to_empty_list)


class CvJdScoreRequest(CamelModel):
    cv: CvInput
    jd: JdInput


class CvJdBatchRequest(CamelModel):
    """Nhiều CV (vd các ứng viên của cùng một tin tuyển dụng) chấm với một JD."""

    jd: JdInput
    cvs: list[CvInput] = Field(..., min_length=1, max_length=500)


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


class CvJdBatchResponse(CamelModel):
    results: list[CvJdScoreResponse] = Field(..., description="Cùng thứ tự với danh sách cvs trong request")


# ---------------------------------------------------------------------------
# Agent gợi ý sửa CV theo JD
# ---------------------------------------------------------------------------

SectionType = Literal["summary", "experience", "project"]


class CvSection(CamelModel):
    """Một mục trong hồ sơ có thể được viết lại: phần giới thiệu, một kinh nghiệm, hoặc một dự án."""

    type: SectionType
    id: int | None = Field(None, description="ID của kinh nghiệm/dự án bên backend-core; null với summary")
    title: str = Field("", description="Vd 'Backend Developer - Công ty ABC'")
    text: str = Field("", description="Nội dung hiện tại")


class CvAdviceRequest(CamelModel):
    sections: list[CvSection] = Field(..., min_length=1, max_length=30)
    skills: list[str] = Field(default_factory=list)
    context: str = Field(
        "", description="Phần hồ sơ không sửa (tiêu đề, học vấn, chứng chỉ, ngoại ngữ) để chấm điểm đúng như /scoring",
    )
    years_of_experience: float | None = Field(None, ge=0)
    jd: JdInput

    _skills_none = field_validator("skills", mode="before")(_none_to_empty_list)

    @field_validator("context", mode="before")
    @classmethod
    def _context_none(cls, value):
        return value or ""


class CvSuggestion(CamelModel):
    section_type: SectionType
    section_id: int | None
    title: str
    original: str
    suggested: str
    reason: str
    score_gain: float = Field(..., description="Điểm tổng tăng thêm nếu chỉ áp dụng riêng gợi ý này")


class CvAdviceResponse(CamelModel):
    current_score: float
    projected_score: float = Field(..., description="Điểm dự kiến khi áp dụng mọi gợi ý được giữ lại")
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[CvSuggestion]
    skill_advice: list[str]
    discarded_suggestions: int = Field(..., description="Số gợi ý của LLM bị loại khi kiểm chứng")
    llm_model: str
    scoring_model: str
