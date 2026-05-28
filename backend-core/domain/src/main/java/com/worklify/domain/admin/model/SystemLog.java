package com.worklify.domain.admin.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SystemLog {
    private Long id;
    private Long userId;
    private String action;
    private String details;
    private LocalDateTime createdAt;

    public static SystemLog record(Long userId, String action, String details) {
        return SystemLog.builder()
                .userId(userId)
                .action(action)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build();
    }
}