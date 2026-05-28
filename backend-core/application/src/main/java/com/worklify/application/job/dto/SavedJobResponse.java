// File: \backend-core\application\src\main\java\com\smartmatch\application\job\dto\SavedJobResponse.java
package com.worklify.application.job.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SavedJobResponse {
    private Long id;
    private Long candidateId;
    private JobPostingResponse job;
    private LocalDateTime savedAt;
}