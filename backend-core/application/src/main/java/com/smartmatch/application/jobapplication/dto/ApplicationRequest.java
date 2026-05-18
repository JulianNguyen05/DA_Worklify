package com.smartmatch.application.jobapplication.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request body nộp đơn ứng tuyển việc làm")
public class ApplicationRequest {

    @NotNull(message = "ID công việc không được để trống")
    @Schema(description = "ID của tin tuyển dụng", example = "100")
    private Long jobId;

    @NotNull(message = "ID CV không được để trống")
    @Schema(description = "ID của CV tài liệu muốn nộp", example = "50")
    private Long cvId;

    @Schema(description = "Thư giới thiệu (Cover Letter)")
    private String coverLetter;
}