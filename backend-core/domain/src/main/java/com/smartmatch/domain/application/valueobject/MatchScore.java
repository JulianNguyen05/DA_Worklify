package com.smartmatch.domain.application.valueobject;

public record MatchScore(Float value) {
    public MatchScore {
        if (value != null && (value < 0.0f || value > 100.0f)) {
            throw new IllegalArgumentException("Điểm số AI Match phải nằm trong khoảng từ 0 đến 100");
        }
    }
}