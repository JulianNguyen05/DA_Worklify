from dataclasses import replace

import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.schemas import CvInput, CvJdScoreRequest, JdInput
from app.services.embedder import BagOfWordsEmbedder
from app.services.scorer import CvJdScorer, extract_required_years
from app.services.skills import SkillDictionary, find_skills
from app.services.text_utils import clean_text, normalize_skill

TEST_SETTINGS = replace(settings, embedding_backend="bow", core_base_url="", require_api_key=False)

JD = """
<p>Tuyển Backend Developer</p>
<ul><li>Tối thiểu 2 năm kinh nghiệm với Java, Spring Boot</li>
<li>Thành thạo MySQL, Docker; biết ReactJS là lợi thế</li></ul>
"""


@pytest.fixture
def scorer() -> CvJdScorer:
    return CvJdScorer(BagOfWordsEmbedder(), SkillDictionary(TEST_SETTINGS), TEST_SETTINGS)


def test_normalize_skill_variants():
    assert normalize_skill("ReactJS") == normalize_skill("React.js") == normalize_skill("React")
    assert normalize_skill("Spring Boot") == "springboot"
    assert normalize_skill("C++") != normalize_skill("C")


def test_find_skills_in_html_jd():
    dictionary = SkillDictionary(TEST_SETTINGS).build()
    assert find_skills(clean_text(JD), dictionary) == ["Java", "Spring Boot", "MySQL", "Docker", "React"]


def test_extract_required_years():
    assert extract_required_years(clean_text(JD)) == 2
    assert extract_required_years("Yêu cầu kinh nghiệm tối thiểu 3 năm") == 3
    assert extract_required_years("Công ty thành lập 10 năm") is None


def test_good_cv_scores_higher_than_unrelated_cv(scorer):
    good = CvInput(
        text="Backend developer 3 năm kinh nghiệm Java, Spring Boot, MySQL, Docker, React",
        years_of_experience=3,
    )
    bad = CvInput(text="Nhân viên kế toán, thành thạo Excel và báo cáo thuế", years_of_experience=1)
    jd = JdInput(text=JD)

    good_result = scorer.score(CvJdScoreRequest(cv=good, jd=jd))
    bad_result = scorer.score(CvJdScoreRequest(cv=bad, jd=jd))

    assert good_result.score > bad_result.score
    assert good_result.missing_skills == []
    assert good_result.breakdown.experience == 100
    assert bad_result.missing_skills == ["Java", "Spring Boot", "MySQL", "Docker", "React"]


def test_batch_matches_single_scoring_and_keeps_order(scorer):
    jd = JdInput(text=JD)
    cvs = [
        CvInput(text="Nhân viên kế toán, thành thạo Excel", years_of_experience=1),
        CvInput(text="Backend 3 năm Java, Spring Boot, MySQL, Docker", years_of_experience=3),
        CvInput(text="Frontend ReactJS 1 năm", skills=["React"], years_of_experience=1),
    ]
    batch = scorer.score_batch(jd, cvs)
    single = [scorer.score(CvJdScoreRequest(cv=cv, jd=jd)) for cv in cvs]

    assert [r.score for r in batch] == [r.score for r in single]
    assert batch[1].score > batch[2].score > batch[0].score


def test_missing_years_requirement_is_skipped(scorer):
    result = scorer.score(CvJdScoreRequest(cv=CvInput(text="Java"), jd=JdInput(text="Cần lập trình viên Java")))
    assert result.breakdown.experience is None
    assert result.required_years_of_experience is None


def test_api_uses_camel_case(monkeypatch):
    monkeypatch.setattr("app.main.settings", TEST_SETTINGS)
    monkeypatch.setattr("app.security.settings", TEST_SETTINGS)
    from app.main import app

    with TestClient(app) as client:
        resp = client.post("/scoring/cv-jd", json={
            "cv": {"text": "Java Spring Boot", "skills": ["Docker"], "yearsOfExperience": 2},
            "jd": {"text": JD},
        })
        assert resp.status_code == 200
        body = resp.json()
        assert {"score", "breakdown", "matchedSkills", "missingSkills", "explanation", "modelVersion"} <= body.keys()
        assert client.post("/parser/extract").status_code == 501

        # Client Java gửi null cho các trường danh sách không có dữ liệu
        with_nulls = client.post("/scoring/cv-jd", json={
            "cv": {"text": "Java", "skills": None, "yearsOfExperience": None},
            "jd": {"text": JD, "requiredSkills": None, "minYearsOfExperience": None},
        })
        assert with_nulls.status_code == 200, with_nulls.text

        batch = client.post("/scoring/cv-jd/batch", json={
            "jd": {"text": JD},
            "cvs": [{"text": "Java Spring Boot"}, {"text": "Kế toán Excel"}],
        })
        assert batch.status_code == 200
        assert len(batch.json()["results"]) == 2
        assert client.post("/scoring/cv-jd/batch", json={"jd": {"text": JD}, "cvs": []}).status_code == 422
