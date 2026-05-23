package com.smartmatch.application.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateSkillRequest {
    @NotBlank(message = "Tên kỹ năng không được để trống")
    private String skillName;
    private String level;
    private String category; // Có thể map vào cột "note" trong DB
    private String description;
}