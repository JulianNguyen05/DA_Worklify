package com.worklify.application.matching.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload gửi sang backend-ml POST /agent/cv-advice: các mục hồ sơ có thể viết lại + JD.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CvAdviceRequest {

    private List<Section> sections;
    private List<String> skills;
    private Double yearsOfExperience;
    /** Phần hồ sơ không sửa (tiêu đề, học vấn, chứng chỉ, ngoại ngữ) để điểm khớp với API chấm điểm. */
    private String context;
    private CvJdScoreRequest.Jd jd;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Section {
        /** "summary" | "experience" | "project" — khớp {@link CvSectionType#getValue()}. */
        private String type;
        /** ID kinh nghiệm/dự án; null với summary. */
        private Long id;
        private String title;
        private String text;
    }
}
