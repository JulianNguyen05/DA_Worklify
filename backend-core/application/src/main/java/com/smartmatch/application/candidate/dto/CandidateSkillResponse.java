package com.smartmatch.application.candidate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateSkillResponse {
    private Long id;          // Tương ứng với skillId
    private String skillName; // Tên kỹ năng (Java, React...)
    private String level;     // Cơ bản, Trung bình...
    private String category;
    private String description;
}