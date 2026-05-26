package com.smartmatch.application.admin.dto;

import lombok.Data;

@Data
public class CompanyModerationRequest {
    private String action; // "APPROVED" hoặc "REJECTED"
    private String reason; // Có thể null nếu APPROVED
}
