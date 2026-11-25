package com.worklify.application.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kết quả chấm điểm CV–JD từ backend-ml. Mọi điểm theo thang 0-100.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvJdScoreResponse {

    private Double score;
    private Breakdown breakdown;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private Double requiredYearsOfExperience;
    private String explanation;
    private String modelVersion;

    /** Điểm thành phần; null nghĩa là không đủ dữ liệu để tính thành phần đó. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Breakdown {
        private Double semantic;
        private Double skills;
        private Double experience;
    }
}
