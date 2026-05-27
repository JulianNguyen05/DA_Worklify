package com.smartmatch.application.admin.dto;

import lombok.Data;

@Data
public class JobModerationRequest {
    private String action; // "APPROVED" hoặc "REJECTED"
    private String reason; // Có thể null nếu APPROVED
}