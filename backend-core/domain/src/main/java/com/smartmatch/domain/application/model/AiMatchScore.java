package com.smartmatch.domain.application.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AiMatchScore {
    private Long id;
    private Long applicationId;
    private Float confidenceScore;
    private String analysisDetails;
    private LocalDateTime evaluatedAt;

    public static AiMatchScore evaluate(Long applicationId, Float score, String details) {
        return AiMatchScore.builder()
                .applicationId(applicationId)
                .confidenceScore(score)
                .analysisDetails(details)
                .evaluatedAt(LocalDateTime.now())
                .build();
    }

    public boolean isHighlyMatched(float threshold) {
        return this.confidenceScore != null && this.confidenceScore >= threshold;
    }
}