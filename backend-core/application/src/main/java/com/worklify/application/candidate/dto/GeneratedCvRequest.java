package com.worklify.application.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GeneratedCvRequest {
    @NotBlank(message = "Nội dung bản thảo không được để trống")
    private String rawText;
}