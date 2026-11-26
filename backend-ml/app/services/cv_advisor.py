"""
Agent gợi ý sửa CV theo JD.

Quy trình (mỗi bước dùng một "công cụ" và kết quả của bước trước):
  1. Đánh giá   - CvJdScorer chấm hồ sơ hiện tại: điểm, kỹ năng khớp / còn thiếu.
  2. Đề xuất    - LLM (Ollama) viết lại phần giới thiệu và mô tả kinh nghiệm/dự án cho sát JD,
                  chỉ được diễn đạt lại thông tin có sẵn và chỉ nhắc tới kỹ năng ứng viên thật sự có.
  3. Tự sửa     - gợi ý nào tự thêm kỹ năng ứng viên không có (bịa đặt): cắt bỏ câu/dòng chứa kỹ năng đó;
                  nếu cắt xong không còn gì dùng được thì gửi lại LLM kèm phản hồi "không được nhắc tới X"
                  để viết lại, tối đa MAX_REVISIONS lần.
  4. Kiểm chứng - ghép từng gợi ý vào hồ sơ rồi chấm lại bằng CvJdScorer. Loại gợi ý trỏ tới mục không tồn
                  tại, không thay đổi gì, vẫn còn bịa kỹ năng, hoặc làm điểm giảm. Tính điểm dự kiến khi
                  áp dụng mọi gợi ý còn lại.
"""
from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass

from app.schemas import (
    CvAdviceRequest,
    CvAdviceResponse,
    CvInput,
    CvSection,
    CvSuggestion,
)
from app.services.llm import LlmClient
from app.services.scorer import CvJdScorer
from app.services.skills import find_skills
from app.services.text_utils import clean_text, normalize_skill, tokenize

logger = logging.getLogger("worklify.cv_advisor")

MAX_SECTIONS_FOR_LLM = 6       # giữ prompt ngắn để model nhỏ chạy nhanh và không bị rối
MAX_SECTION_CHARS = 900
MAX_JD_CHARS = 2500
MAX_SUGGESTED_CHARS = 1200
MIN_SCORE_GAIN = -0.5          # cho phép dao động rất nhỏ do làm tròn
MAX_SKILL_ADVICE = 5
MAX_REVISIONS = 1              # số lần gửi lại LLM để sửa gợi ý bịa kỹ năng / làm mất ý
MAX_STRIPPED_RATIO = 1 / 3     # cắt câu bịa kỹ năng tối đa 1/3 số câu, nhiều hơn thì cho LLM viết lại
MIN_CONTENT_COVERAGE = 0.4     # bản viết lại phải giữ >= 40% từ ngữ nội dung của bản gốc
MIN_TOKENS_FOR_COVERAGE = 8    # bản gốc ngắn hơn thì không kiểm tra (vd phần giới thiệu 1 câu)

# Từ phổ biến không mang nội dung, bỏ qua khi so độ giữ ý (tiếng Việt tách theo âm tiết)
STOPWORDS = {
    "và", "các", "của", "cho", "có", "là", "được", "để", "với", "trong", "một", "những", "này", "khi", "đã",
    "bằng", "từ", "theo", "như", "lên", "ra", "vào", "về", "the", "and", "for", "with", "of", "to", "in",
}

SECTION_LABELS = {"summary": "Giới thiệu bản thân", "experience": "Kinh nghiệm", "project": "Dự án"}

SYSTEM_PROMPT = """Bạn là chuyên gia tư vấn tuyển dụng, giúp ứng viên viết lại CV cho phù hợp với một tin tuyển dụng.
QUY TẮC BẮT BUỘC:
- Chỉ diễn đạt lại, sắp xếp lại, nhấn mạnh thông tin ĐÃ CÓ trong CV. TUYỆT ĐỐI KHÔNG bịa thêm công ty, chức danh, con số, năm kinh nghiệm, dự án hay kỹ năng mà CV không nhắc tới.
- Chỉ được nhắc tới các kỹ năng/công nghệ nằm trong danh sách "KỸ NĂNG ĐƯỢC PHÉP NHẮC TỚI". Các kỹ năng trong danh sách "CẤM NHẮC TỚI" không được xuất hiện trong nội dung viết lại dưới bất kỳ hình thức nào.
- Ưu tiên dùng đúng thuật ngữ của tin tuyển dụng cho những việc ứng viên đã làm (vd "xây dựng REST API", "tối ưu hiệu năng").
- Kỹ năng ứng viên còn thiếu chỉ được đưa vào "skill_advice" dưới dạng lời khuyên.
- Viết tiếng Việt, ngắn gọn, chuyên nghiệp. Mô tả kinh nghiệm/dự án viết thành các gạch đầu dòng bắt đầu bằng "- ".
- Chỉ trả về MỘT object JSON đúng cấu trúc được yêu cầu, không kèm giải thích nào khác."""

RESPONSE_SCHEMA = {
    "suggestions": [{"key": "một key trong danh sách mục", "suggested": "nội dung viết lại", "reason": "vì sao sửa"}],
    "skill_advice": ["lời khuyên về kỹ năng còn thiếu"],
}


@dataclass
class _Candidate:
    key: str
    section: CvSection
    suggested: str
    reason: str


def _section_key(section: CvSection) -> str:
    return "summary" if section.type == "summary" else f"{section.type}:{section.id}"


def _cv_text(sections: list[CvSection], skills: list[str], context: str) -> str:
    lines = []
    for s in sections:
        body = clean_text(s.text)
        if body:
            lines.append(f"{s.title}: {body}" if s.title else body)
    if skills:
        lines.append("Kỹ năng: " + ", ".join(skills))
    if context.strip():
        lines.append(clean_text(context))
    return "\n".join(line for line in lines if line.strip())


class CvAdvisor:
    def __init__(self, scorer: CvJdScorer, llm: LlmClient):
        self._scorer = scorer
        self._llm = llm

    def advise(self, request: CvAdviceRequest) -> CvAdviceResponse:
        sections = [s for s in request.sections if clean_text(s.text) or s.type == "summary"]
        base_cv = self._cv(request, sections, {})

        # 1. Đánh giá hồ sơ hiện tại
        current = self._scorer.score_batch(request.jd, [base_cv])[0]

        # Kỹ năng ứng viên thật sự có: khai báo + đã nhắc tới trong hồ sơ hiện tại
        skill_map = self._scorer.skill_map(extra=[*request.skills, *request.jd.required_skills])
        known_names = list(dict.fromkeys([*request.skills, *find_skills(base_cv.text, skill_map)]))
        known_keys = {normalize_skill(s) for s in known_names}
        forbidden = [s for s in current.missing_skills if normalize_skill(s) not in known_keys]

        # 2. LLM đề xuất
        editable = self._pick_sections(sections)
        raw = self._llm.chat_json(SYSTEM_PROMPT, self._build_prompt(request, editable, current, known_names, forbidden))
        candidates, invalid = self._parse_suggestions(raw, editable)
        honest, fabricated = self._split_fabricated(candidates, skill_map, known_keys)

        # 3. Tự sửa: gửi lại những gợi ý bịa kỹ năng kèm phản hồi cụ thể
        fabricated_count, recovered = len(fabricated), 0
        for _ in range(MAX_REVISIONS):
            if not fabricated:
                break
            retry_sections = [c.section for c, _ in fabricated]
            feedback = sorted({skill for _, skills in fabricated for skill in skills})
            raw_retry = self._llm.chat_json(
                SYSTEM_PROMPT,
                self._build_prompt(request, retry_sections, current, known_names, forbidden,
                                   retry=True, feedback=feedback),
            )
            retried, _ = self._parse_suggestions(raw_retry, retry_sections)
            honest_retry, fabricated = self._split_fabricated(retried, skill_map, known_keys)
            honest += honest_retry
            recovered += len(honest_retry)

        # 4. Kiểm chứng bằng cách chấm lại
        kept, worse = self._verify(request, sections, current.score, honest)
        projected = current.score
        if kept:
            projected = self._scorer.score_batch(
                request.jd, [self._cv(request, sections, {c.key: c.suggested for c, _ in kept})])[0].score

        return CvAdviceResponse(
            current_score=current.score,
            projected_score=max(projected, current.score),
            matched_skills=current.matched_skills,
            missing_skills=current.missing_skills,
            suggestions=[
                CvSuggestion(
                    section_type=c.section.type, section_id=c.section.id,
                    title=c.section.title or SECTION_LABELS[c.section.type],
                    original=c.section.text, suggested=c.suggested, reason=c.reason, score_gain=round(gain, 1),
                )
                for c, gain in kept
            ],
            skill_advice=self._skill_advice(raw, current.missing_skills),
            discarded_suggestions=invalid + (fabricated_count - recovered) + worse,
            llm_model=self._llm.model,
            scoring_model=self._scorer.model_version,
        )

    # ------------------------------------------------------------------ prompt

    @staticmethod
    def _pick_sections(sections: list[CvSection]) -> list[CvSection]:
        order = {"summary": 0, "experience": 1, "project": 2}
        return sorted(sections, key=lambda s: order[s.type])[:MAX_SECTIONS_FOR_LLM]

    @staticmethod
    def _build_prompt(request: CvAdviceRequest, editable: list[CvSection], current,
                      known: list[str], forbidden: list[str], retry: bool = False,
                      feedback: list[str] | None = None) -> str:
        jd_text = clean_text(request.jd.text)[:MAX_JD_CHARS]
        items = [
            {
                "key": _section_key(s),
                "loai": SECTION_LABELS[s.type],
                "tieu_de": s.title,
                "noi_dung_hien_tai": clean_text(s.text)[:MAX_SECTION_CHARS] or "(đang để trống)",
            }
            for s in editable
        ]
        parts = [
            f"TIN TUYỂN DỤNG:\n{jd_text}",
            f"KỸ NĂNG ĐƯỢC PHÉP NHẮC TỚI (ứng viên thật sự có): {', '.join(known) or 'không có'}",
            f"CẤM NHẮC TỚI (JD yêu cầu nhưng ứng viên chưa có): {', '.join(forbidden) or 'không có'}",
            f"CÁC MỤC TRONG CV CÓ THỂ VIẾT LẠI:\n{json.dumps(items, ensure_ascii=False, indent=1)}",
        ]
        if retry:
            problem = (f"tự thêm kỹ năng ứng viên không có ({', '.join(feedback)})" if feedback
                       else "làm mất các ý chính của nội dung hiện tại")
            parts.append(
                f"LẦN TRƯỚC bạn đã viết lại các mục trên nhưng {problem}. Hãy viết lại: GIỮ ĐỦ mọi ý trong "
                "nội dung hiện tại (chỉ diễn đạt lại cho chuyên nghiệp, sát JD hơn) và KHÔNG nhắc tới kỹ năng "
                "trong danh sách CẤM."
            )
        else:
            parts.append(
                "Hãy viết lại những mục cần cải thiện nhất (tối đa một gợi ý cho mỗi key, bỏ qua mục đã tốt). "
                "Nếu mục 'summary' đang để trống, hãy viết mới dựa trên các kinh nghiệm/dự án có sẵn."
            )
        parts.append(f"Trả về JSON theo đúng cấu trúc: {json.dumps(RESPONSE_SCHEMA, ensure_ascii=False)}")
        return "\n\n".join(parts)

    # ------------------------------------------------------------- validation

    @staticmethod
    def _parse_suggestions(raw: dict, editable: list[CvSection]) -> tuple[list[_Candidate], int]:
        by_key = {_section_key(s): s for s in editable}
        seen, candidates, invalid = set(), [], 0
        items = raw.get("suggestions") if isinstance(raw.get("suggestions"), list) else []
        for item in items:
            if not isinstance(item, dict):
                invalid += 1
                continue
            key = str(item.get("key", "")).strip()
            suggested = clean_text(str(item.get("suggested", "")))[:MAX_SUGGESTED_CHARS].strip()
            section = by_key.get(key)
            # Bỏ gợi ý không thay đổi gì, kể cả khi chỉ khác dấu câu / gạch đầu dòng
            unchanged = section is not None and tokenize(clean_text(suggested)) == tokenize(clean_text(section.text))
            if section is None or key in seen or not suggested or unchanged:
                invalid += 1
                continue
            seen.add(key)
            reason = clean_text(str(item.get("reason", ""))).strip() or "Viết lại cho sát yêu cầu công việc hơn."
            candidates.append(_Candidate(key, section, suggested, reason))
        return candidates, invalid

    @staticmethod
    def _invented_skills(text: str, skill_map: dict[str, str], known_keys: set[str]) -> list[str]:
        return [s for s in find_skills(text, skill_map) if normalize_skill(s) not in known_keys]

    @classmethod
    def _strip_invented(cls, text: str, skill_map: dict[str, str], known_keys: set[str]) -> str | None:
        """
        Bỏ các dòng / câu có nhắc tới kỹ năng ứng viên không có. Trả về None nếu phải bỏ quá
        MAX_STRIPPED_RATIO số câu: khi đó phần còn lại thường mất ý chính, nên để LLM viết lại.
        """
        kept_lines, total, removed = [], 0, 0
        for line in text.splitlines():
            sentences = [s for s in re.split(r"(?<=[.!?;])\s+", line) if s.strip(" -•")]
            total += len(sentences)
            kept = [s for s in sentences if not cls._invented_skills(s, skill_map, known_keys)]
            removed += len(sentences) - len(kept)
            if kept:
                kept_lines.append(" ".join(kept).strip())
        if not total or removed / total > MAX_STRIPPED_RATIO:
            return None
        return "\n".join(kept_lines).strip()

    @staticmethod
    def _content_tokens(text: str) -> set[str]:
        return {t for t in tokenize(clean_text(text)) if len(t) >= 2 and t not in STOPWORDS}

    @classmethod
    def _keeps_content(cls, original: str, suggested: str) -> bool:
        """Bản viết lại phải giữ lại phần lớn ý của bản gốc (không áp dụng khi bản gốc quá ngắn hoặc trống)."""
        orig = cls._content_tokens(original)
        if len(orig) < MIN_TOKENS_FOR_COVERAGE:
            return True
        return len(orig & cls._content_tokens(suggested)) / len(orig) >= MIN_CONTENT_COVERAGE

    @classmethod
    def _split_fabricated(cls, candidates: list[_Candidate], skill_map: dict[str, str], known_keys: set[str]):
        """
        Chia gợi ý thành (dùng được, cần LLM viết lại). Cần viết lại khi:
        - tự thêm kỹ năng ứng viên không có và không cắt gọn được (phải bỏ quá nhiều câu);
        - làm mất ý chính của bản gốc (giữ lại quá ít từ ngữ nội dung).
        """
        honest, rejected = [], []
        for c in candidates:
            invented = cls._invented_skills(c.suggested, skill_map, known_keys)
            text, reason = c.suggested, c.reason
            if invented:
                logger.info("Gợi ý %s tự thêm kỹ năng: %s", c.key, invented)
                stripped = cls._strip_invented(c.suggested, skill_map, known_keys)
                if not stripped or stripped == clean_text(c.section.text):
                    rejected.append((c, invented))
                    continue
                text = stripped
                reason += f" (Đã bỏ phần nhắc tới {', '.join(invented)} vì hồ sơ của bạn chưa có kỹ năng này.)"
            if not cls._keeps_content(c.section.text, text):
                logger.info("Gợi ý %s làm mất ý chính của bản gốc", c.key)
                rejected.append((c, invented))
                continue
            honest.append(_Candidate(c.key, c.section, text, reason))
        return honest, rejected

    def _verify(self, request, sections, current_score, honest: list[_Candidate]):
        if not honest:
            return [], 0
        scores = self._scorer.score_batch(
            request.jd, [self._cv(request, sections, {c.key: c.suggested}) for c in honest])
        kept, worse = [], 0
        for c, s in zip(honest, scores):
            gain = s.score - current_score
            if gain >= MIN_SCORE_GAIN:
                kept.append((c, max(gain, 0.0)))
            else:
                logger.info("Loại gợi ý %s vì làm điểm giảm %.1f", c.key, gain)
                worse += 1
        kept.sort(key=lambda pair: pair[1], reverse=True)
        return kept, worse

    @staticmethod
    def _cv(request: CvAdviceRequest, sections: list[CvSection], applied: dict[str, str]) -> CvInput:
        replaced = [
            s.model_copy(update={"text": applied[_section_key(s)]}) if _section_key(s) in applied else s
            for s in sections
        ]
        text = _cv_text(replaced, request.skills, request.context)
        return CvInput(text=text or " ", skills=request.skills, years_of_experience=request.years_of_experience)

    @staticmethod
    def _skill_advice(raw: dict, missing: list[str]) -> list[str]:
        advice = raw.get("skill_advice") if isinstance(raw.get("skill_advice"), list) else []
        cleaned = [clean_text(str(a)).strip() for a in advice if str(a).strip()]
        if not cleaned and missing:
            cleaned = [f"Nếu bạn đã từng làm việc với {skill}, hãy ghi rõ trong kinh nghiệm hoặc dự án; "
                       f"nếu chưa, đây là kỹ năng nên tìm hiểu thêm." for skill in missing]
        return cleaned[:MAX_SKILL_ADVICE]
