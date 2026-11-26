package com.worklify.domain.application.model;

import java.util.EnumSet;
import java.util.Set;

public enum ApplicationStatus {
    PENDING,
    REVIEWED,
    INTERVIEW_SCHEDULED,
    ACCEPTED,
    REJECTED;

    /** Các trạng thái kế tiếp hợp lệ trong quy trình tuyển dụng. */
    public Set<ApplicationStatus> nextStatuses() {
        return switch (this) {
            case PENDING -> EnumSet.of(REVIEWED, REJECTED);
            case REVIEWED -> EnumSet.of(INTERVIEW_SCHEDULED, ACCEPTED, REJECTED);
            case INTERVIEW_SCHEDULED -> EnumSet.of(ACCEPTED, REJECTED);
            case ACCEPTED, REJECTED -> EnumSet.noneOf(ApplicationStatus.class);
        };
    }

    public boolean canMoveTo(ApplicationStatus next) {
        return nextStatuses().contains(next);
    }
}
