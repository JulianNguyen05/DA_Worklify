package com.worklify.application.job.dto;

import com.worklify.domain.job.model.JobStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class JobPostingResponse {
    private Long id;
    private Long companyId;
    private String title;
    private String description;
    private String requirements;
    private String salaryRange;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String workType;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String companyName;
    private String logoUrl;
    // Tin đang mở và còn hạn nộp (ứng viên nộp được)
    private boolean openForApplications;
}
