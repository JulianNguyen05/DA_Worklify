// File: \backend-core\application\src\main\java\com\smartmatch\application\job\dto\JobPostingResponse.java
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

    private String requirements;
    private String salaryRange;
    private String location;

    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
}