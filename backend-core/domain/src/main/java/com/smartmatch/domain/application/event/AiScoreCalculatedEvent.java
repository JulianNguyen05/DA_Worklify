package com.smartmatch.domain.application.event;

import com.smartmatch.domain.application.valueobject.MatchScore;
import java.time.LocalDateTime;

public record AiScoreCalculatedEvent(Long applicationId, MatchScore score, LocalDateTime timestamp) {}