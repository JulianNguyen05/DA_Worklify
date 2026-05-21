package com.smartmatch.application.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalCandidates;
    private long totalEmployers;
    private long activeJobs;
    private long totalApplications;
}
