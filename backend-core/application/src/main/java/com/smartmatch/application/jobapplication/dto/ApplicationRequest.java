package com.smartmatch.application.jobapplication.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull(message = "ID tin tuyển dụng không được để trống")
    private Long jobId;
    @NotNull(message = "ID tài liệu CV không được để trống")
    private Long cvId;
    private String coverLetter;
}