package com.smartmatch.application.job.dto;

import com.smartmatch.domain.job.model.JobStatus;
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
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
}