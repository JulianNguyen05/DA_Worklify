package com.worklify.application.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload gửi sang backend-ml POST /scoring/cv-jd.
 * Tên field khớp JSON camelCase phía FastAPI (app/schemas.py).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvJdScoreRequest {

    private Cv cv;
    private Jd jd;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Cv {
        private String text;
        private List<String> skills;
        private Double yearsOfExperience;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Jd {
        private String text;
        /** Để trống thì backend-ml tự trích xuất kỹ năng từ text của JD. */
        private List<String> requiredSkills;
        /** Để null thì backend-ml tự đoán từ text (vd "tối thiểu 2 năm kinh nghiệm"). */
        private Double minYearsOfExperience;
    }
}
