package com.smartmatch.domain.application.repository;

import com.smartmatch.domain.application.model.AiMatchScore;
import java.util.Optional;

public interface AiMatchScoreRepository {
    AiMatchScore save(AiMatchScore aiMatchScore);
    Optional<AiMatchScore> findByApplicationId(Long applicationId);
}