"""
Chấm điểm mức độ phù hợp giữa CV và JD.

Điểm tổng = trung bình có trọng số của 3 thành phần (thang 0-100):
  - semantic:   độ tương đồng ngữ nghĩa giữa toàn văn CV và JD (embedding)
  - skills:     tỉ lệ kỹ năng yêu cầu trong JD mà CV có
  - experience: số năm kinh nghiệm so với yêu cầu
Thành phần không đủ dữ liệu sẽ bị bỏ qua và trọng số được chuẩn hoá lại.

Khi có model fine-tune từ Colab, chỉ cần thay embedder (xem app/services/embedder.py);
phần ghép điểm và giải thích ở đây giữ nguyên.
"""
from __future__ import annotations

import re

from app.config import Settings
from app.schemas import CvInput, CvJdScoreRequest, CvJdScoreResponse, JdInput, ScoreBreakdown
from app.services.embedder import Embedder
from app.services.skills import SkillDictionary, find_skills
from app.services.text_utils import clean_text, normalize_skill

_NUM = r"(\d+(?:[.,]\d+)?)"
_YEARS_PATTERNS = [
    # "2 năm kinh nghiệm", "3+ years of experience"
    re.compile(_NUM + r"\s*\+?\s*(?:năm|years?|yrs?)\s*(?:kinh nghiệm|of experience|experience)", re.IGNORECASE),
    # "kinh nghiệm tối thiểu 2 năm", "experience: at least 3 years"
    re.compile(r"(?:kinh nghiệm|experience)[^.\n\d]{0,30}?" + _NUM + r"\s*\+?\s*(?:năm|years?|yrs?)", re.IGNORECASE),
]
_MAX_LISTED_MISSING = 5


def extract_required_years(jd_text: str) -> float | None:
    values = [float(m.group(1).replace(",", ".")) for p in _YEARS_PATTERNS for m in p.finditer(jd_text)]
    values = [v for v in values if 0 < v <= 20]
    return min(values) if values else None


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class CvJdScorer:
    def __init__(self, embedder: Embedder, skill_dictionary: SkillDictionary, settings: Settings):
        self._embedder = embedder
        self._skills = skill_dictionary
        self._settings = settings

    @property
    def model_version(self) -> str:
        return self._embedder.name

    def skill_map(self, extra: list[str] = ()) -> dict[str, str]:
        """Danh mục kỹ năng (khoá chuẩn hoá -> tên hiển thị), dùng chung với agent gợi ý sửa CV."""
        return self._skills.build(extra=extra)

    def _calibrate(self, raw: float) -> float:
        low, high = self._settings.semantic_sim_low, self._settings.semantic_sim_high
        return _clamp01((raw - low) / (high - low)) if high > low else _clamp01(raw)

    def score(self, request: CvJdScoreRequest) -> CvJdScoreResponse:
        return self.score_batch(request.jd, [request.cv])[0]

    def score_batch(self, jd: JdInput, cvs: list[CvInput]) -> list[CvJdScoreResponse]:
        """Chấm nhiều CV cho cùng một JD: JD chỉ được embed và phân tích một lần."""
        jd_text = clean_text(jd.text)
        cv_texts = [clean_text(cv.text) for cv in cvs]

        semantics = [self._calibrate(raw) for raw in self._embedder.similarities(jd_text, cv_texts)]
        dictionary = self._skills.build(extra=[*jd.required_skills, *(s for cv in cvs for s in cv.skills)])
        jd_skills = jd.required_skills or find_skills(jd_text, dictionary)
        required_years = jd.min_years_of_experience
        if required_years is None:
            required_years = extract_required_years(jd_text)

        return [
            self._score_one(cv, cv_text, semantic, jd_skills, required_years, dictionary)
            for cv, cv_text, semantic in zip(cvs, cv_texts, semantics)
        ]

    def _score_one(self, cv: CvInput, cv_text: str, semantic: float, jd_skills: list[str],
                   required_years: float | None, dictionary: dict[str, str]) -> CvJdScoreResponse:
        # 2. Kỹ năng
        cv_skill_keys = {normalize_skill(s) for s in cv.skills}
        cv_skill_keys |= {normalize_skill(s) for s in find_skills(cv_text, dictionary)}
        matched = [s for s in jd_skills if normalize_skill(s) in cv_skill_keys]
        missing = [s for s in jd_skills if normalize_skill(s) not in cv_skill_keys]
        skills = len(matched) / len(jd_skills) if jd_skills else None

        # 3. Kinh nghiệm
        cv_years = cv.years_of_experience or 0.0
        experience = None if not required_years else _clamp01(cv_years / required_years)

        # Ghép điểm, bỏ qua thành phần không có dữ liệu
        parts = [
            (semantic, self._settings.weight_semantic),
            (skills, self._settings.weight_skills),
            (experience, self._settings.weight_experience),
        ]
        available = [(value, weight) for value, weight in parts if value is not None and weight > 0]
        total_weight = sum(w for _, w in available)
        total = sum(v * w for v, w in available) / total_weight if total_weight else semantic

        score = round(total * 100, 1)
        return CvJdScoreResponse(
            score=score,
            breakdown=ScoreBreakdown(
                semantic=round(semantic * 100, 1),
                skills=None if skills is None else round(skills * 100, 1),
                experience=None if experience is None else round(experience * 100, 1),
            ),
            matched_skills=matched,
            missing_skills=missing,
            required_years_of_experience=required_years,
            explanation=self._explain(score, matched, missing, required_years, cv_years),
            model_version=self.model_version,
        )

    @staticmethod
    def _explain(score: float, matched: list[str], missing: list[str],
                 required_years: float | None, cv_years: float) -> str:
        level = "cao" if score >= 75 else "trung bình" if score >= 50 else "thấp"
        sentences = [f"Mức độ phù hợp {level} ({score:g}/100)."]

        total_skills = len(matched) + len(missing)
        if total_skills:
            sentences.append(f"CV đáp ứng {len(matched)}/{total_skills} kỹ năng mà JD yêu cầu.")
        if missing:
            listed = ", ".join(missing[:_MAX_LISTED_MISSING])
            more = f" và {len(missing) - _MAX_LISTED_MISSING} kỹ năng khác" if len(missing) > _MAX_LISTED_MISSING else ""
            sentences.append(f"Còn thiếu: {listed}{more}.")
        if required_years:
            if cv_years >= required_years:
                sentences.append(f"Kinh nghiệm {cv_years:g} năm, đạt yêu cầu tối thiểu {required_years:g} năm.")
            else:
                sentences.append(f"Kinh nghiệm {cv_years:g} năm, chưa đạt yêu cầu tối thiểu {required_years:g} năm.")
        return " ".join(sentences)
