// File: \backend-core\application\src\main\java\com\smartmatch\application\job\dto\JobPostingRequest.java
package com.smartmatch.application.job.dto;

import jakarta.validation.constraints.NotBlank;
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

    private String salaryRange; // Có thể null nếu công ty muốn thỏa thuận

    @NotBlank(message = "Địa điểm làm việc không được để trống")
    private String location;

    private String workType;

    private LocalDateTime expiredAt;
}