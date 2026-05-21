// File: \backend-core\application\src\main\java\com\smartmatch\application\job\dto\SavedJobResponse.java
package com.smartmatch.application.job.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SavedJobResponse {
    private Long id;
    private Long candidateId;
    private JobPostingResponse job; // Trả về luôn thông tin chi tiết của Job
    private LocalDateTime savedAt;
}