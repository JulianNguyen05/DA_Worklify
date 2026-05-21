package com.smartmatch.application.jobapplication.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AiMatchScoreResponse {
    private Long id;
    private Long applicationId;
    private Float confidenceScore;
    private String analysisDetails;
    private LocalDateTime evaluatedAt;
}