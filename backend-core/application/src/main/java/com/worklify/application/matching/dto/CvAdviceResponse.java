package com.worklify.application.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kết quả agent gợi ý sửa CV từ backend-ml. Điểm theo thang 0-100.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvAdviceResponse {

    private Double currentScore;
    /** Điểm dự kiến nếu áp dụng mọi gợi ý (đã được backend-ml chấm lại để kiểm chứng). */
    private Double projectedScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<Suggestion> suggestions;
    private List<String> skillAdvice;
    /** Số gợi ý của LLM bị loại (bịa kỹ năng, làm giảm điểm, trỏ sai mục...). */
    private Integer discardedSuggestions;
    private String llmModel;
    private String scoringModel;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Suggestion {
        private String sectionType;
        private Long sectionId;
        private String title;
        private String original;
        private String suggested;
        private String reason;
        private Double scoreGain;
    }
}
