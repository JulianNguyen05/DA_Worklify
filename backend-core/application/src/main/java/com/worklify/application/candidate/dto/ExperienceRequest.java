package com.worklify.application.candidate.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExperienceRequest {
    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;
    private String position;
    private String employmentType;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    // Lombok sinh isCurrent() nên Jackson mặc định đặt tên "current"; frontend dùng key "isCurrent"
    @JsonProperty("isCurrent")
    private boolean isCurrent;
    private String description;
    private int displayOrder;
}
