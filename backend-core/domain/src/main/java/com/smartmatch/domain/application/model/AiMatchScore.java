package com.smartmatch.domain.application.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_match_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMatchScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;

    @Column(name = "confidence_score", nullable = false)
    private Float confidenceScore;

    @Column(name = "analysis_details", columnDefinition = "TEXT")
    private String analysisDetails;

    @Column(name = "evaluated_at", nullable = false)
    private LocalDateTime evaluatedAt;
}