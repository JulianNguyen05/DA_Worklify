package com.worklify.domain.application.event;

import java.time.LocalDateTime;

public record ApplicationSubmittedEvent(Long applicationId, Long candidateId, Long jobId, LocalDateTime timestamp) {}