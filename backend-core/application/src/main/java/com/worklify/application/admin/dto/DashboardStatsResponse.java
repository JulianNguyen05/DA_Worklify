package com.worklify.application.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long activeJobs;
    private long pendingJobs;
    private long successfulApplications;

    private List<ChartData> userGrowth;
    private List<ChartData> jobDistribution;

    @Data
    @Builder
    public static class ChartData {
        private String name;
        private long value;
    }
}
