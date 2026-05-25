package com.smartmatch.application.admin.service.impl;

import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.admin.service.AdminService;
import com.smartmatch.application.auth.dto.UserResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.application.model.ApplicationStatus;
import com.smartmatch.domain.application.repository.ApplicationRepository;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.DomainPageable;
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
        // TODO: Cài đặt logic cập nhật trạng thái Job
    }

    @Override
    public void moderateCompany(Long companyId, boolean approve) {
        // TODO: Cài đặt logic duyệt/từ chối hồ sơ doanh nghiệp
    }

    @Override
    public void createSkillMasterData(MasterDataRequest request) {
        // TODO: Cài đặt logic thêm mới dữ liệu kỹ năng
    }

    @Override
    public void deleteSkillMasterData(Long skillId) {
        // TODO: Cài đặt logic xóa dữ liệu kỹ năng
    }

    @Override
    public PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable) {
        // TODO: Cài đặt logic lấy danh sách nhật ký hệ thống
        return null;
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(DomainPageable pageable) {
        // TODO: Cài đặt logic lấy danh sách người dùng
        return null;
    }

    @Override
    public void banUser(Long userId) {
        // TODO: Cài đặt logic khóa tài khoản người dùng
    }

    @Override
    public void unbanUser(Long userId) {
        // TODO: Cài đặt logic mở khóa tài khoản người dùng
    }
}