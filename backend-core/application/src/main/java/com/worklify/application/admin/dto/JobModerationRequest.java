package com.worklify.application.admin.dto;

import lombok.Data;

@Data
public class JobModerationRequest {
    private String action; // "APPROVE" hoặc "REJECT"
    private String reason; // Có thể null nếu approve
}