package com.worklify.application.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateSkillRequest {
    @NotBlank(message = "Tên kỹ năng không được để trống")
    private String skillName;
    private String level;
    // Ánh xạ vào cột note của bảng candidate_skills
    private String description;
}