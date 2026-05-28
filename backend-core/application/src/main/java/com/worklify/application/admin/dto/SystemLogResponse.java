package com.worklify.application.admin.dto;


import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SystemLogResponse {
    private Long id;
    private Long userId;
    private String action;
    private String details;
    private LocalDateTime createdAt;
}