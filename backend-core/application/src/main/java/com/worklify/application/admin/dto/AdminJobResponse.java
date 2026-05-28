package com.worklify.application.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminJobResponse {
    private Long id;
    private String title;
    private String companyName;
    private String salaryRange;
    private String location;
    private String workType;
    private String description;
    private String requirements;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}