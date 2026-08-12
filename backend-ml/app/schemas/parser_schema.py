# app/schemas/parser_schema.py
"""
Schemas cho CV Parser.
Field names được đặt khớp với các DTO Java hiện có bên backend-core
(EducationRequest, ExperienceRequest, CandidateSkillRequest, AwardRequest,
CertificationRequest, ActivityRequest, ProjectRequest, HobbyResponse)
để backend-core có thể deserialize thẳng response mà không cần mapper riêng.
"""
from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ExtractionSource(str, Enum):
    RULE_BASED = "RULE_BASED"
    NER_MODEL = "NER_MODEL"  # dùng ở Giai đoạn 3, chưa active ở bản này


# ---------- Field-level wrapper mang theo confidence ----------

class ExtractedField(BaseModel):
    """
    Bọc quanh mỗi giá trị trích xuất, kèm độ tin cậy và nguồn.
    Giúp frontend biết field nào nên yêu cầu người dùng xác nhận lại
    thay vì tin tuyệt đối vào kết quả tự động.
    """
    value: Optional[str] = None
    confidence: float = Field(ge=0.0, le=1.0, default=0.0)
    source: ExtractionSource = ExtractionSource.RULE_BASED


# ---------- Các nhóm dữ liệu khớp với candidate_profiles ----------

class ContactInfo(BaseModel):
    email: Optional[ExtractedField] = None
    phone: Optional[ExtractedField] = None
    linkedin_url: Optional[ExtractedField] = None
    github_url: Optional[ExtractedField] = None
    website_url: Optional[ExtractedField] = None
    date_of_birth: Optional[ExtractedField] = None
    gender: Optional[ExtractedField] = None
    address: Optional[ExtractedField] = None


# Name/Location tách riêng khỏi ContactInfo — không phải "cách liên hệ",
# và nguồn dữ liệu khác (NER model thay vì regex).


class EducationItem(BaseModel):
    school: Optional[ExtractedField] = None
    degree: Optional[ExtractedField] = None
    start_date: Optional[ExtractedField] = None
    end_date: Optional[ExtractedField] = None
    raw_text: str  # đoạn text gốc, để người dùng đối chiếu khi sửa


class ExperienceItem(BaseModel):
    job_title: Optional[ExtractedField] = None
    company: Optional[ExtractedField] = None
    start_date: Optional[ExtractedField] = None
    end_date: Optional[ExtractedField] = None
    raw_text: str


class SkillItem(BaseModel):
    name: str
    # skill_id khớp với reference_values.id nếu tìm được match trong catalog
    matched_skill_id: Optional[int] = None
    confidence: float = Field(ge=0.0, le=1.0, default=0.0)


class HobbyItem(BaseModel):
    """Khớp HobbyResponse.java (name)."""
    name: str


class AwardItem(BaseModel):
    """Khớp AwardRequest.java (title, issuer, awardedDate, description).
    awarded_date giữ dạng string thô (vd "12/2023") — CHƯA parse thành
    LocalDate ở baseline này vì độ tin cậy ngày tháng từ OCR/rule-based
    còn thấp; nên để backend-core hoặc người dùng xác nhận/parse lại
    trước khi lưu, tránh insert sai LocalDate mà không ai kiểm tra."""
    title: str
    issuer: Optional[str] = None
    awarded_date: Optional[str] = None
    description: Optional[str] = None
    raw_text: str


class CertificationItem(BaseModel):
    """Khớp CertificationRequest.java (name, issuingOrg, issueDate,
    expiryDate, credentialId, credentialUrl). expiry_date/credential_id/
    credential_url baseline không trích xuất được (không có heuristic rõ
    ràng để tách trong text tự do), luôn None — chờ người dùng bổ sung."""
    name: str
    issuing_org: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    raw_text: str


class ActivityItem(BaseModel):
    """Khớp ActivityRequest.java (organization, role, startDate, endDate,
    description). end_date baseline thường None vì layout phổ biến chỉ ghi
    1 mốc thời gian cho hoạt động (vd "06/2021"), không phải khoảng."""
    organization: str
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    raw_text: str


class ProjectItem(BaseModel):
    """Khớp ProjectRequest.java (projectName, role, techStack, projectUrl,
    startDate, endDate, description)."""
    project_name: str
    role: Optional[str] = None
    tech_stack: Optional[str] = None
    project_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    raw_text: str


# ---------- Response tổng ----------

class ParsedCvResponse(BaseModel):
    raw_text: str
    contact: ContactInfo
    full_name: Optional[ExtractedField] = None  # nguồn: NER (entity "Name", F1=0.82 trên test — khá tin cậy)
    location: Optional[ExtractedField] = None    # nguồn: NER (entity "Location", F1=0.65 — khá tin cậy)
    educations: list[EducationItem] = []
    experiences: list[ExperienceItem] = []
    skills: list[SkillItem] = []
    summary_text: Optional[str] = None
    hobbies: list[HobbyItem] = []
    projects: list[ProjectItem] = []
    awards: list[AwardItem] = []
    certifications: list[CertificationItem] = []
    activities: list[ActivityItem] = []
    warnings: list[str] = []  # vd: "Không đọc được text từ PDF scan, cần OCR"