
// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\persistence\entity\AiMatchScoreJpaEntity.java
package com.worklify.infrastructure.persistence.entity;

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
public class AiMatchScoreJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false)
    private Long applicationId;

    @Column(name = "confidence_score", nullable = false)
    private Float confidenceScore;

    @Column(name = "analysis_details", columnDefinition = "TEXT")
    private String analysisDetails;

    @Column(name = "evaluated_at", nullable = false, updatable = false)
    private LocalDateTime evaluatedAt;
}

