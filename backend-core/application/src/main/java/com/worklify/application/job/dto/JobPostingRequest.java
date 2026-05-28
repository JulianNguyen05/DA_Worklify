// File: \backend-core\application\src\main\java\com\smartmatch\application\job\dto\JobPostingRequest.java
package com.worklify.application.job.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobPostingRequest {
    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    @NotBlank(message = "Yêu cầu công việc không được để trống")
    private String requirements;

    private String salaryRange;

    @NotBlank(message = "Địa điểm làm việc không được để trống")
    private String location;

    private String workType;

    @NotNull(message = "Hạn nộp hồ sơ không được để trống")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;
}