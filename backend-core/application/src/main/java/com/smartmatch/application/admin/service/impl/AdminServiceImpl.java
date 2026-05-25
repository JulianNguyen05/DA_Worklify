package com.smartmatch.application.admin.service.impl;

import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.service.AdminService;
import com.smartmatch.domain.application.model.ApplicationStatus;
import com.smartmatch.domain.application.repository.ApplicationRepository;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // 1. Lấy dữ liệu số lượng tổng quan
        long totalUsers = userRepository.count();
        long activeJobs = jobPostingRepository.countByStatus(JobStatus.ACTIVE);
        long pendingJobs = jobPostingRepository.countByStatus(JobStatus.PENDING);
        long successApps = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED); // Giả định có status này

        // 2. Dữ liệu giả lập cho Biểu đồ (Thực tế bạn sẽ query Group By theo ngày/tháng trong DB)
        List<DashboardStatsResponse.ChartData> userGrowth = List.of(
                DashboardStatsResponse.ChartData.builder().name("T2").value(120).build(),
                DashboardStatsResponse.ChartData.builder().name("T3").value(250).build(),
                DashboardStatsResponse.ChartData.builder().name("T4").value(380).build(),
                DashboardStatsResponse.ChartData.builder().name("T5").value(500).build()
        );

        List<DashboardStatsResponse.ChartData> jobDist = List.of(
                DashboardStatsResponse.ChartData.builder().name("Đang hoạt động").value(activeJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Chờ duyệt").value(pendingJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Đã đóng").value(45).build() // Số liệu giả định
        );

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeJobs(activeJobs)
                .pendingJobs(pendingJobs)
                .successfulApplications(successApps)
                .userGrowth(userGrowth)
                .jobDistribution(jobDist)
                .build();
    }

    @Override
    public void moderateJob(Long jobId, JobStatus status) {
        // Cài đặt logic cập nhật trạng thái Job
    }

    @Override
    public void banUser(Long userId) {
        // Cài đặt logic ban User
    }
}