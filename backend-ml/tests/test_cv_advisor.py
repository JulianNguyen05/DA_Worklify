from dataclasses import replace

from fastapi.testclient import TestClient

from app.config import settings
from app.schemas import CvAdviceRequest, CvSection, JdInput
from app.services.cv_advisor import CvAdvisor
from app.services.embedder import BagOfWordsEmbedder
from app.services.llm import LlmUnavailableError
from app.services.scorer import CvJdScorer
from app.services.skills import SkillDictionary

TEST_SETTINGS = replace(settings, embedding_backend="bow", core_base_url="", require_api_key=False)

JD = ("Tuyển Backend Developer. Yêu cầu: tối thiểu 2 năm kinh nghiệm Java, Spring Boot, MySQL, Docker. "
      "Xây dựng REST API, tối ưu hiệu năng hệ thống.")

HONEST_EXPERIENCE = {
    "key": "experience:11",
    "suggested": "- Xây dựng REST API bằng Java, MySQL\n- Tối ưu hiệu năng hệ thống",
    "reason": "Dùng đúng thuật ngữ JD",
}
FABRICATED_SUMMARY = {"key": "summary", "suggested": "Backend Developer thành thạo Spring Boot và Java", "reason": "x"}
HONEST_SUMMARY = {"key": "summary", "suggested": "Backend Developer xây dựng REST API bằng Java và MySQL", "reason": "y"}


class FakeLlm:
    """LLM giả: trả lần lượt các response cho mỗi lần gọi (hết thì lặp lại response cuối)."""

    model = "fake-llm"

    def __init__(self, *responses, error=None):
        self.responses, self.error, self.prompts = list(responses), error, []

    def chat_json(self, system, user):
        self.prompts.append(user)
        if self.error:
            raise self.error
        return self.responses[min(len(self.prompts), len(self.responses)) - 1]


def make_request():
    return CvAdviceRequest(
        sections=[
            CvSection(type="summary", text="Lập trình viên thích học hỏi."),
            CvSection(type="experience", id=11, title="Lập trình viên - Công ty ABC",
                      text="Làm web cho công ty bằng Java và MySQL."),
            CvSection(type="project", id=21, title="Dự án quản lý kho", text="Làm phần backend."),
        ],
        skills=["Java", "MySQL"],
        years_of_experience=2,
        context="Cử nhân CNTT - Đại học ABC",
        jd=JdInput(text=JD),
    )


def make_advisor(llm):
    scorer = CvJdScorer(BagOfWordsEmbedder(), SkillDictionary(TEST_SETTINGS), TEST_SETTINGS)
    return CvAdvisor(scorer, llm)


def test_keeps_honest_suggestion_and_drops_invalid_ones():
    llm = FakeLlm({
        "suggestions": [
            HONEST_EXPERIENCE,
            {"key": "experience:999", "suggested": "abc", "reason": "x"},     # mục không tồn tại
            {"key": "project:21", "suggested": "- Làm phần backend", "reason": "x"},  # chỉ khác dấu câu
        ],
        "skill_advice": ["Nếu bạn đã dùng Spring Boot, hãy ghi rõ trong kinh nghiệm."],
    })
    result = make_advisor(llm).advise(make_request())

    assert len(llm.prompts) == 1  # không có gợi ý bịa kỹ năng -> không cần tự sửa
    assert [(s.section_type, s.section_id) for s in result.suggestions] == [("experience", 11)]
    assert result.discarded_suggestions == 2
    assert result.projected_score >= result.current_score
    assert result.skill_advice == ["Nếu bạn đã dùng Spring Boot, hãy ghi rõ trong kinh nghiệm."]
    assert result.llm_model == "fake-llm"


def test_prompt_lists_allowed_and_forbidden_skills():
    llm = FakeLlm({"suggestions": []})
    make_advisor(llm).advise(make_request())
    prompt = llm.prompts[0]
    assert "KỸ NĂNG ĐƯỢC PHÉP NHẮC TỚI (ứng viên thật sự có): Java, MySQL" in prompt
    assert "Spring Boot" in prompt.split("CẤM NHẮC TỚI")[1].split("\n")[0]


def test_lines_with_invented_skills_are_stripped_without_retry():
    mixed = {
        "key": "experience:11",
        "suggested": ("- Làm web cho công ty bằng Java và MySQL\n"
                      "- Xây dựng REST API bằng Java và MySQL cho hệ thống nội bộ\n"
                      "- Triển khai microservices với Spring Boot"),
        "reason": "Sát JD",
    }
    llm = FakeLlm({"suggestions": [mixed]})
    result = make_advisor(llm).advise(make_request())

    assert len(llm.prompts) == 1
    assert [s.section_id for s in result.suggestions] == [11]
    assert "Spring Boot" not in result.suggestions[0].suggested
    assert "REST API" in result.suggestions[0].suggested
    assert "Đã bỏ phần nhắc tới" in result.suggestions[0].reason
    assert "Spring Boot" in result.suggestions[0].reason
    assert result.discarded_suggestions == 0


def test_stripping_too_much_triggers_rewrite_instead():
    # Bỏ 1/2 số dòng thì phần còn lại thường mất ý -> không cắt mà cho LLM viết lại
    half_fabricated = {
        "key": "experience:11",
        "suggested": "- Xây dựng REST API bằng Java và MySQL\n- Triển khai microservices với Spring Boot",
        "reason": "x",
    }
    llm = FakeLlm({"suggestions": [half_fabricated]}, {"suggestions": [HONEST_EXPERIENCE]})
    result = make_advisor(llm).advise(make_request())
    assert len(llm.prompts) == 2
    assert result.suggestions[0].suggested == HONEST_EXPERIENCE["suggested"]


def test_rewrite_that_loses_original_content_is_retried():
    request = make_request()
    long_exp = ("- Phát triển chức năng quản lý đơn hàng bằng Java\n"
                "- Viết truy vấn MySQL, sửa lỗi chậm\n"
                "- Đóng gói ứng dụng bằng Docker để triển khai lên server")
    request.sections[1] = request.sections[1].model_copy(update={"text": long_exp})
    request = request.model_copy(update={"skills": ["Java", "MySQL", "Docker"]})

    lossy = {"key": "experience:11", "suggested": "- Sử dụng MySQL để quản lý cơ sở dữ liệu", "reason": "x"}
    faithful = {"key": "experience:11", "reason": "Giữ đủ ý, dùng thuật ngữ JD",
                "suggested": ("- Phát triển chức năng quản lý đơn hàng bằng Java\n"
                              "- Tối ưu hiệu năng truy vấn MySQL, sửa lỗi chậm\n"
                              "- Đóng gói và triển khai ứng dụng lên server bằng Docker")}
    llm = FakeLlm({"suggestions": [lossy]}, {"suggestions": [faithful]})
    result = make_advisor(llm).advise(request)

    assert len(llm.prompts) == 2
    assert "làm mất các ý chính" in llm.prompts[1]
    assert [s.suggested for s in result.suggestions] == [faithful["suggested"]]


def test_self_correction_recovers_fabricated_suggestion():
    llm = FakeLlm({"suggestions": [FABRICATED_SUMMARY]}, {"suggestions": [HONEST_SUMMARY]})
    result = make_advisor(llm).advise(make_request())

    assert len(llm.prompts) == 2
    assert "Spring Boot" in llm.prompts[1].split("LẦN TRƯỚC")[1]  # phản hồi nêu rõ kỹ năng bịa
    assert [s.section_type for s in result.suggestions] == ["summary"]
    assert result.suggestions[0].suggested == HONEST_SUMMARY["suggested"]
    assert result.discarded_suggestions == 0


def test_fabricated_suggestion_is_dropped_when_self_correction_fails():
    llm = FakeLlm({"suggestions": [FABRICATED_SUMMARY]}, {"suggestions": [FABRICATED_SUMMARY]})
    result = make_advisor(llm).advise(make_request())

    assert len(llm.prompts) == 2
    assert result.suggestions == []
    assert result.discarded_suggestions == 1
    assert result.projected_score == result.current_score


def test_context_is_part_of_scored_text():
    with_ctx = make_advisor(FakeLlm({"suggestions": []})).advise(make_request())
    request = make_request().model_copy(update={"context": ""})
    without_ctx = make_advisor(FakeLlm({"suggestions": []})).advise(request)
    assert with_ctx.current_score != without_ctx.current_score


def test_falls_back_to_generated_skill_advice():
    result = make_advisor(FakeLlm({"suggestions": []})).advise(make_request())
    assert result.suggestions == []
    assert any("Spring Boot" in a for a in result.skill_advice)


def test_garbage_llm_output_is_ignored():
    result = make_advisor(FakeLlm({"suggestions": "không phải list", "skill_advice": None})).advise(make_request())
    assert result.suggestions == []


def test_api_returns_503_when_llm_is_down(monkeypatch):
    monkeypatch.setattr("app.main.settings", TEST_SETTINGS)
    monkeypatch.setattr("app.security.settings", TEST_SETTINGS)
    from app.main import app

    with TestClient(app) as client:
        app.state.cv_advisor = make_advisor(FakeLlm(error=LlmUnavailableError("Ollama chưa chạy")))
        resp = client.post("/agent/cv-advice", json=make_request().model_dump(by_alias=True))
        assert resp.status_code == 503
        assert "Ollama" in resp.json()["detail"]
