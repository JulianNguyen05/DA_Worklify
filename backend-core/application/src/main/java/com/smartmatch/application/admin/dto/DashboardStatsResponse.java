package com.smartmatch.application.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    // Thẻ số lượng tổng quan
    private long totalUsers;
    private long activeJobs;
    private long pendingJobs;
    private long successfulApplications;

    // Dữ liệu cho Biểu đồ
    private List<ChartData> userGrowth; // Dùng cho biểu đồ đường
    private List<ChartData> jobDistribution; // Dùng cho biểu đồ tròn

    @Data
    @Builder
    public static class ChartData {
        private String name;
        private long value;
    }
}
