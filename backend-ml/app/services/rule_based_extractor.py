# app/services/rule_based_extractor.py
"""
Giai đoạn [4] của pipeline (baseline không dùng ML) + [5] post-processing.

Đây là baseline "chạy được ngay" — dùng để:
  1. Có API hoạt động thật trong lúc chờ dataset gán nhãn cho NER (Giai đoạn 2-3)
  2. Làm fallback khi model NER không tự tin (post Giai đoạn 4)
  3. Pre-label dữ liệu cho Label Studio, giảm công gán nhãn tay
"""
from __future__ import annotations

import re

from app.schemas.parser_schema import (
    ActivityItem,
    AwardItem,
    CertificationItem,
    ContactInfo,
    EducationItem,
    ExperienceItem,
    ExtractedField,
    HobbyItem,
    ProjectItem,
    SkillItem,
)

# ---------------------------------------------------------------------------
# Regex patterns cho các field có cấu trúc rõ ràng (không cần ML)
# ---------------------------------------------------------------------------

_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

# Số VN: 0xxxxxxxxx hoặc +84xxxxxxxxx, cho phép khoảng trắng/dấu chấm phân tách
_PHONE_RE = re.compile(r"(?:\+84|0)(?:[\s.-]?\d){9,10}")

_LINKEDIN_RE = re.compile(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+/?", re.I)
_GITHUB_RE = re.compile(r"(?:https?://)?(?:www\.)?github\.com/[\w-]+/?", re.I)
_WEBSITE_RE = re.compile(
    r"(?:https?://)?(?:www\.)?[\w-]+\.[a-z]{2,}(?:/[\w./-]*)?", re.I
)

# Ngày sinh / giới tính / địa chỉ — value luôn nằm CÙNG DÒNG với label trong
# layout info-block phổ biến (vd "Date of Birth } 20/05/1996"), nên match
# theo từng dòng (_first_match_per_line), không search cả block.
# [:\}\|] chấp nhận cả ':' lẫn '}'/'|' vì OCR hay đọc nhầm dấu ':' thành 2 ký
# tự này (đã quan sát thực tế trên CV mẫu).
_DOB_RE = re.compile(
    r"(?:date\s*of\s*birth|dob|ngày\s*sinh)\s*[:\}\|]?\s*"
    r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
    re.I,
)
_GENDER_RE = re.compile(
    r"(?:gender|giới\s*tính)\s*[:\}\|]?\s*(male|female|nam|nữ|other)",
    re.I,
)
_ADDRESS_RE = re.compile(
    r"(?:address|địa\s*chỉ)\s*[:\}\|]?\s*(.+)",
    re.I,
)

# Date pattern dùng chung cho các section dạng "card" (Award/Certification/
# Activity/Project): mm/yyyy hoặc dd/mm/yyyy. KHÔNG match số năm trần
# ("2023" không kèm dấu /) để tránh dính vào chữ số nằm trong tên field
# (vd "Employee of the Year 2023" — chữ "2023" ở đây KHÔNG phải ngày).
_SINGLE_DATE_RE = re.compile(r"\d{1,2}[/-](?:\d{1,2}[/-])?\d{2,4}")
_DATE_RANGE_RE = re.compile(
    r"(\d{1,2}[/-]\d{2,4})\s*-\s*(\d{1,2}[/-]\d{2,4}|present|hiện\s*tại)", re.I
)
_TECH_STACK_RE = re.compile(r"technolog(?:y|ies)\s*[:\}\|]\s*(.+)", re.I)

# Heading phổ biến trong CV tiếng Anh (không phân biệt hoa/thường).
# Danh sách này khớp với các block type CV Builder của Worklify đã hỗ trợ
# (candidate_activities, candidate_awards, candidate_certifications,
# candidate_hobbies, candidate_projects trong DB) — cần nhận diện đủ, tránh
# 1 section "nuốt" hết nội dung section sau nó do không tìm thấy boundary.
_SECTION_HEADINGS = {
    "education": [
        r"education", r"academic\s*background",
    ],
    "experience": [
        r"experience", r"work\s*history", r"employment\s*history",
    ],
    "skills": [
        r"skills", r"technical\s*skills",
    ],
    "summary": [
        r"summary", r"objective", r"about\s*me", r"profile",
        r"career\s*(goal|objective)",
    ],
    "activities": [
        r"activit\w*", r"extracurricular",
    ],
    "certifications": [
        r"certificat\w*",
    ],
    "awards": [
        r"awards?", r"honou?rs?",
    ],
    "hobbies": [
        r"hobb\w*", r"interests?",
    ],
    "projects": [
        r"projects?",
    ],
    "references": [
        r"references?", r"referee",
    ],
}


def extract_contact(text: str) -> ContactInfo:
    email = _first_match(_EMAIL_RE, text)
    phone = _first_match(_PHONE_RE, text)
    linkedin = _first_match(_LINKEDIN_RE, text)
    github = _first_match(_GITHUB_RE, text)
    dob = _first_match_per_line(_DOB_RE, text)
    gender = _first_match_per_line(_GENDER_RE, text)
    address = _first_match_per_line(_ADDRESS_RE, text)

    return ContactInfo(
        email=_to_field(email, confidence=0.95 if email else 0.0),
        phone=_to_field(phone, confidence=0.9 if phone else 0.0),
        linkedin_url=_to_field(linkedin, confidence=0.9 if linkedin else 0.0),
        github_url=_to_field(github, confidence=0.9 if github else 0.0),
        date_of_birth=_to_field(dob, confidence=0.85 if dob else 0.0),
        gender=_to_field(gender, confidence=0.85 if gender else 0.0),
        address=_to_field(address, confidence=0.7 if address else 0.0),
    )


def split_sections(text: str) -> dict[str, str]:
    """
    Cắt CV thành các khối theo heading. Trả về dict {section_name: block_text}.
    Section không tìm thấy heading sẽ vắng mặt trong dict (không phải lỗi —
    nhiều CV không có heading rõ ràng, để lại cho NER xử lý ở Giai đoạn 3).
    """
    lines = text.splitlines()
    heading_pattern = re.compile(
        "|".join(
            f"(?P<{name}>{'|'.join(patterns)})"
            for name, patterns in _SECTION_HEADINGS.items()
        ),
        re.I,
    )

    markers: list[tuple[int, str]] = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Heading thường ngắn (<6 từ) và không kết thúc bằng dấu câu thường thấy
        # trong câu văn -> giảm false positive khi từ khóa xuất hiện giữa câu
        if len(stripped.split()) <= 6:
            m = heading_pattern.search(stripped)
            if m:
                section_name = m.lastgroup
                markers.append((i, section_name))

    sections: dict[str, str] = {}
    for idx, (line_no, name) in enumerate(markers):
        end = markers[idx + 1][0] if idx + 1 < len(markers) else len(lines)
        block = "\n".join(lines[line_no + 1 : end]).strip()
        if block:
            sections[name] = block

    return sections


def extract_skills(
    skills_block: str, skill_catalog: dict[str, int]
) -> list[SkillItem]:
    """
    Dictionary lookup: so khớp text trong block "Kỹ năng" với skill_catalog
    (lấy từ bảng reference_values qua backend-core).

    skill_catalog: {skill_name_lowercase: skill_id}

    Vì skill catalog là closed-set, cách này chính xác hơn NER cho riêng
    trường skill, và không cần train gì cả.

    Match 2 tầng vì dấu "/" mang 2 ý nghĩa xung đột nhau tùy ngữ cảnh:
    - Trong CV: thường là dấu liệt kê nhiều skill khác nhau
      (vd "PHP / JavaScript / MySQL" = 3 skill riêng biệt)
    - Trong catalog thực tế (reference_values): có thể là 1 phần tên skill
      ghép (vd "PHP / Laravel" = 1 skill duy nhất trong DB)
    Nên PHẢI thử khớp cả cụm gốc (chưa tách theo "/") trước; chỉ tách nhỏ
    theo "/" làm fallback khi cụm gốc không khớp catalog nào — tránh phá vỡ
    đúng những skill ghép có thật trong catalog.
    """
    if not skills_block:
        return []

    # Tầng 1: tách theo dấu phẩy/chấm phẩy/xuống dòng — KHÔNG tách theo "/"
    # ở bước này, để giữ nguyên cụm ghép có thể khớp thẳng catalog.
    coarse_candidates = re.split(r"[,;\n•·|]", skills_block)

    found: list[SkillItem] = []
    seen_ids: set[int] = set()

    for raw in coarse_candidates:
        cleaned = raw.strip(" -\t")
        if not cleaned:
            continue

        skill_id = skill_catalog.get(cleaned.lower())
        if skill_id is not None:
            _add_matched(found, seen_ids, cleaned, skill_id)
            continue

        # Cụm gốc không khớp -> fallback tách nhỏ theo "/" và thử khớp từng
        # phần riêng (case "PHP / JavaScript / MySQL" — 3 skill khác nhau,
        # không có trong catalog dưới dạng cụm ghép).
        if "/" in cleaned:
            sub_parts = [p.strip() for p in cleaned.split("/") if p.strip()]
            any_sub_matched = False
            for part in sub_parts:
                sub_skill_id = skill_catalog.get(part.lower())
                if sub_skill_id is not None:
                    _add_matched(found, seen_ids, part, sub_skill_id)
                    any_sub_matched = True
                else:
                    found.append(SkillItem(name=part, matched_skill_id=None, confidence=0.2))
            if any_sub_matched:
                continue
        else:
            # Không có "/" để fallback -> giữ nguyên như cũ, confidence thấp
            found.append(SkillItem(name=cleaned, matched_skill_id=None, confidence=0.2))

    return found


def extract_educations(education_block: str) -> list[EducationItem]:
    """
    Baseline đơn giản: coi mỗi đoạn cách nhau bởi dòng trống là 1 mục học vấn.
    Đây là phần rule-based yếu nhất — NER (Giai đoạn 3) sẽ cải thiện đáng kể
    độ chính xác so với heuristic này, đặc biệt với CV không có format rõ ràng.
    """
    if not education_block:
        return []

    chunks = _split_by_blank_line(education_block)
    return [EducationItem(raw_text=chunk) for chunk in chunks]


def extract_experiences(experience_block: str) -> list[ExperienceItem]:
    """Tương tự extract_educations — baseline thô, chờ NER thay thế."""
    if not experience_block:
        return []

    chunks = _split_by_blank_line(experience_block)
    return [ExperienceItem(raw_text=chunk) for chunk in chunks]


def extract_hobbies(hobbies_block: str) -> list[HobbyItem]:
    """Hobbies liệt kê ngắn (tag/bullet), tách theo dòng hoặc dấu phẩy —
    KHÔNG dùng _split_by_blank_line vì hobby không có cấu trúc đa dòng."""
    if not hobbies_block:
        return []
    raw_items = re.split(r"[,\n•·]", hobbies_block)
    return [HobbyItem(name=h.strip(" -\t")) for h in raw_items if h.strip(" -\t")]


def extract_awards(awards_block: str) -> list[AwardItem]:
    """
    CHÚ Ý: KHÔNG dùng _split_by_blank_line — layout "card" (title+date /
    issuer / description) tách bởi dòng trống thành 3 ĐOẠN RIÊNG cho CÙNG
    1 award, nếu chia theo dòng trống sẽ ra 3 award giả thay vì 1 award
    thật. Dùng _split_card_items: gom theo "dòng chứa date = mốc bắt đầu
    item mới" thay vì theo dòng trống.
    """
    items: list[AwardItem] = []
    for lines in _split_card_items(awards_block):
        title, date = _split_title_and_date(lines[0])
        issuer = lines[1] if len(lines) > 1 else None
        description = "\n".join(lines[2:]) if len(lines) > 2 else None
        items.append(
            AwardItem(
                title=title or lines[0],
                issuer=issuer,
                awarded_date=date,
                description=description,
                raw_text="\n".join(lines),
            )
        )
    return items


def extract_certifications(certifications_block: str) -> list[CertificationItem]:
    """Cùng cấu trúc card như Award (name+date / issuing_org / mô tả thừa
    không map được vào CertificationRequest.java nên chỉ giữ trong raw_text)."""
    items: list[CertificationItem] = []
    for lines in _split_card_items(certifications_block):
        name, date = _split_title_and_date(lines[0])
        issuing_org = lines[1] if len(lines) > 1 else None
        items.append(
            CertificationItem(
                name=name or lines[0],
                issuing_org=issuing_org,
                issue_date=date,
                raw_text="\n".join(lines),
            )
        )
    return items


def extract_activities(activities_block: str) -> list[ActivityItem]:
    """Layout card: "organization + date" / "role" / mô tả."""
    items: list[ActivityItem] = []
    for lines in _split_card_items(activities_block):
        organization, date = _split_title_and_date(lines[0])
        role = lines[1] if len(lines) > 1 else None
        description = "\n".join(lines[2:]) if len(lines) > 2 else None
        items.append(
            ActivityItem(
                organization=organization or lines[0],
                role=role,
                start_date=date,
                description=description,
                raw_text="\n".join(lines),
            )
        )
    return items


def extract_projects(projects_block: str) -> list[ProjectItem]:
    """Layout card: "project_name + date_range" / "role" / mô tả (có thể
    kèm dòng "Technologies: ..." -> tách riêng thành tech_stack)."""
    items: list[ProjectItem] = []
    for lines in _split_card_items(projects_block, date_pattern=_DATE_RANGE_RE):
        name, date_range = _split_title_and_date_range(lines[0])
        role = lines[1] if len(lines) > 1 else None
        remaining_lines = lines[2:]

        tech_stack = None
        description_lines = []
        for line in remaining_lines:
            m = _TECH_STACK_RE.search(line)
            if m:
                tech_stack = m.group(1).strip()
            else:
                description_lines.append(line)

        start_date, end_date = date_range if date_range else (None, None)
        items.append(
            ProjectItem(
                project_name=name or lines[0],
                role=role,
                tech_stack=tech_stack,
                start_date=start_date,
                end_date=end_date,
                description="\n".join(description_lines) or None,
                raw_text="\n".join(lines),
            )
        )
    return items


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _first_match(pattern: re.Pattern, text: str) -> str | None:
    m = pattern.search(text)
    return m.group(0) if m else None


def _first_match_per_line(pattern: re.Pattern, text: str) -> str | None:
    """Áp dụng regex theo từng dòng — dùng cho field mà value luôn nằm
    cùng dòng với label (Address, DOB, Gender). Tránh '.+' của Address
    nuốt nhầm nội dung field/dòng kế tiếp nếu search trên cả block."""
    for line in text.splitlines():
        m = pattern.search(line.strip())
        if m:
            return m.group(1).strip()
    return None


def _to_field(value: str | None, confidence: float) -> ExtractedField:
    return ExtractedField(value=value, confidence=confidence)


def _add_matched(found: list[SkillItem], seen_ids: set[int], name: str, skill_id: int) -> None:
    if skill_id in seen_ids:
        return
    seen_ids.add(skill_id)
    found.append(SkillItem(name=name, matched_skill_id=skill_id, confidence=0.9))


def _split_by_blank_line(block: str) -> list[str]:
    """Coi mỗi đoạn cách nhau bởi dòng trống là 1 mục. Dùng cho Education/
    Experience — KHÔNG dùng cho Award/Certification/Activity/Project vì
    layout "card" của các section đó tách nội dung 1 item thành nhiều đoạn
    (xem _split_card_items)."""
    if not block:
        return []
    return [c.strip() for c in re.split(r"\n\s*\n", block) if c.strip()]


def _split_card_items(
    block: str, date_pattern: re.Pattern = _SINGLE_DATE_RE
) -> list[list[str]]:
    """
    Tách 1 section dạng "card" (Award/Certification/Activity/Project) thành
    từng item dựa trên DÒNG CÓ CHỨA DATE — dòng có date luôn là dòng mở đầu
    1 item mới (title/name + date), các dòng theo sau (không có date) thuộc
    về item đó cho tới khi gặp dòng có date tiếp theo.

    Nếu dòng đầu tiên của block không có date (CV không ghi date, hoặc OCR
    làm mất date), coi cả block là 1 item duy nhất — an toàn hơn là bỏ sót
    nội dung.
    """
    lines = [l.strip() for l in block.splitlines() if l.strip()]
    if not lines:
        return []

    items: list[list[str]] = []
    current: list[str] = []
    for line in lines:
        if date_pattern.search(line) and current:
            items.append(current)
            current = []
        current.append(line)
    if current:
        items.append(current)

    return items


def _split_title_and_date(line: str) -> tuple[str | None, str | None]:
    """Tách 1 dòng dạng "Tên ... 12/2023" thành (tên, ngày). Nếu không tìm
    thấy date, trả về (None, None) — caller tự fallback dùng cả dòng làm tên."""
    m = _SINGLE_DATE_RE.search(line)
    if not m:
        return None, None
    date = m.group(0)
    title = (line[: m.start()] + line[m.end() :]).strip(" -–|\t")
    return (title or None), date


def _split_title_and_date_range(
    line: str,
) -> tuple[str | None, tuple[str | None, str | None] | None]:
    """Tách 1 dòng dạng "Tên dự án 01/2023 - 11/2023" thành
    (tên, (start_date, end_date)). Fallback về _split_title_and_date (ngày
    đơn) nếu dòng không có date range."""
    m = _DATE_RANGE_RE.search(line)
    if m:
        title = (line[: m.start()] + line[m.end() :]).strip(" -–|\t")
        return (title or None), (m.group(1), m.group(2))

    title, single_date = _split_title_and_date(line)
    if single_date:
        return title, (single_date, None)
    return None, None