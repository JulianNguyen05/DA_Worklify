package com.worklify.application.candidate.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String projectName;
    private String role;
    private String techStack;
    private String projectUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    // Lombok sinh isCurrent() nên Jackson mặc định đặt tên "current"; frontend dùng key "isCurrent"
    @JsonProperty("isCurrent")
    private boolean isCurrent;
    private String description;
    private int displayOrder;
}
