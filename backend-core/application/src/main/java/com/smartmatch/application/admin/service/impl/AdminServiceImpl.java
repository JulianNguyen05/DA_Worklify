package com.smartmatch.application.admin.service.impl;

import com.smartmatch.application.admin.dto.AdminJobResponse;
import com.smartmatch.application.common.exception.ResourceNotFoundException;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.domain.employer.repository.CompanyProfileRepository;
import com.smartmatch.domain.admin.repository.SystemLogRepository;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.admin.service.AdminService;
import com.smartmatch.application.auth.dto.UserResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.admin.model.SystemLog;
import com.smartmatch.domain.application.model.ApplicationStatus;
import com.smartmatch.domain.application.repository.ApplicationRepository;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.model.VerificationStatus; // Cần import thêm Enum này
import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // Import cho stream map

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    // Bổ sung các Repository cần thiết cho nghiệp vụ kiểm duyệt
    private final CompanyProfileRepository companyProfileRepository;
    private final SystemLogRepository systemLogRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // 1. Lấy dữ liệu số lượng tổng quan
        long totalUsers = userRepository.count();
        long activeJobs = jobPostingRepository.countByStatus(JobStatus.ACTIVE);
        long pendingJobs = jobPostingRepository.countByStatus(JobStatus.PENDING);
        long successApps = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED);

        // 2. Dữ liệu giả lập cho Biểu đồ
        List<DashboardStatsResponse.ChartData> userGrowth = List.of(
                DashboardStatsResponse.ChartData.builder().name("T2").value(120).build(),
                DashboardStatsResponse.ChartData.builder().name("T3").value(250).build(),
                DashboardStatsResponse.ChartData.builder().name("T4").value(380).build(),
                DashboardStatsResponse.ChartData.builder().name("T5").value(500).build()
        );

        List<DashboardStatsResponse.ChartData> jobDist = List.of(
                DashboardStatsResponse.ChartData.builder().name("Đang hoạt động").value(activeJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Chờ duyệt").value(pendingJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Đã đóng").value(45).build()
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
    public void moderateJob(Long jobId, boolean approve, String reason) {
        // 1. Tìm tin tuyển dụng
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));

        // 2. Chuyển đổi trạng thái thông qua Domain Method đã định nghĩa trong JobPosting.java
        String actionLog = "";
        if (approve) {
            job.publish(); // Đổi status thành ACTIVE
            actionLog = "APPROVE_JOB";
            // TODO: (Mở rộng sau) Gửi email thông báo cho nhà tuyển dụng
        } else {
            job.reject(); // Đổi status thành REJECTED
            actionLog = "REJECT_JOB";
            // TODO: (Mở rộng sau) Gửi email báo lỗi kèm 'reason'
        }

        jobPostingRepository.save(job);

        // 3. Lưu vết System Log
        Long currentAdminId = 1L; // Giả định ID Admin hiện tại
        SystemLog log = SystemLog.record(
                currentAdminId,
                actionLog,
                "Job ID: " + jobId + (approve ? "" : ". Lý do: " + reason)
        );
        systemLogRepository.save(log);
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

    @Override
    public List<CompanyProfileResponse> getPendingCompanies() {
        // Lấy danh sách các công ty đang ở trạng thái PENDING từ Database
        List<CompanyProfile> pendingProfiles = companyProfileRepository.findByVerificationStatus(VerificationStatus.PENDING);

        // Map Domain Entity sang DTO Response để trả về cho Frontend
        return pendingProfiles.stream()
                .map(profile -> CompanyProfileResponse.builder()
                        .id(profile.getId())
                        .companyName(profile.getCompanyName())
                        .website(profile.getWebsite())
                        // Thêm các trường khác (như logoUrl) nếu DTO của bạn yêu cầu
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void moderateCompany(Long companyId, boolean approve, String reason) {
        // 1. Tìm công ty
        CompanyProfile company = companyProfileRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy doanh nghiệp"));

        // 2. Thay đổi trạng thái
        String actionLog = "";
        if (approve) {
            company.approve();
            actionLog = "APPROVE_COMPANY";
            // TODO: Gửi email thông báo tài khoản doanh nghiệp đã được duyệt
        } else {
            company.reject();
            actionLog = "REJECT_COMPANY";
            // TODO: Gửi email kèm 'reason' yêu cầu chỉnh sửa
        }

        companyProfileRepository.save(company);

        // 3. Lưu vết System Log
        Long currentAdminId = 1L;
        SystemLog log = SystemLog.record(
                currentAdminId,
                actionLog,
                "Company ID: " + companyId + (approve ? "" : ". Lý do: " + reason)
        );
        systemLogRepository.save(log);
    }

    // Đừng quên import DTO: import com.smartmatch.application.admin.dto.AdminJobResponse;

    @Override
    public List<AdminJobResponse> getPendingJobs() {
        // 1. Lấy danh sách Job có trạng thái PENDING
        List<JobPosting> pendingJobs = jobPostingRepository.findByStatus(JobStatus.PENDING);

        // 2. Map sang DTO và tìm Tên công ty tương ứng
        return pendingJobs.stream().map(job -> {
            String companyName = companyProfileRepository.findById(job.getCompanyId())
                    .map(CompanyProfile::getCompanyName)
                    .orElse("Doanh nghiệp không xác định");

            return AdminJobResponse.builder()
                    .id(job.getId())
                    .title(job.getTitle())
                    .companyName(companyName)
                    .salaryRange(job.getSalaryRange())
                    .location(job.getLocation())
                    .workType(job.getWorkType())
                    .description(job.getDescription())
                    .requirements(job.getRequirements())
                    .createdAt(job.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}