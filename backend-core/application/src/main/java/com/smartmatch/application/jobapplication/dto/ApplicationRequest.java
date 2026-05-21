package com.smartmatch.application.jobapplication.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull(message = "ID công việc không được để trống")
    private Long jobId;

    @NotNull(message = "ID CV không được để trống")
    private Long cvId;

    private String coverLetter;
}