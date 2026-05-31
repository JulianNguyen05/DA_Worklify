package com.worklify.application.admin.service.impl;

import com.worklify.application.admin.dto.AdminJobResponse;
import com.worklify.application.common.exception.ResourceNotFoundException;
import com.worklify.application.employer.dto.CompanyProfileResponse;
import com.worklify.domain.auth.model.User;
import com.worklify.domain.candidate.model.Skill;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.candidate.repository.SkillRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.employer.repository.CompanyLikeRepository;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.domain.admin.repository.SystemLogRepository;
import com.worklify.application.admin.dto.DashboardStatsResponse;
import com.worklify.application.admin.dto.MasterDataRequest;
import com.worklify.application.admin.dto.SystemLogResponse;
import com.worklify.application.admin.service.AdminService;
import com.worklify.application.auth.dto.UserResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.domain.admin.model.SystemLog;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.application.repository.ApplicationRepository;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.model.VerificationStatus; // Cần import thêm Enum này
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobStatus;
import com.worklify.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors; // Import cho stream map

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyLikeRepository companyLikeRepository;
    private final SystemLogRepository systemLogRepository;
    private final SkillRepository skillRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    // Admin ID thực tế nên được lấy từ SecurityContext — tạm dùng hằng số
    private static final Long SYSTEM_ADMIN_ID = 1L;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeJobs = jobPostingRepository.countByStatus(JobStatus.ACTIVE);
        long pendingJobs = jobPostingRepository.countByStatus(JobStatus.PENDING);
        long successApps = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED);

        List<DashboardStatsResponse.ChartData> userGrowth = List.of(
                DashboardStatsResponse.ChartData.builder().name("T2").value(120).build(),
                DashboardStatsResponse.ChartData.builder().name("T3").value(250).build(),
                DashboardStatsResponse.ChartData.builder().name("T4").value(380).build(),
                DashboardStatsResponse.ChartData.builder().name("T5").value(500).build()
        );

        List<DashboardStatsResponse.ChartData> jobDist = List.of(
                DashboardStatsResponse.ChartData.builder().name("Đang hoạt động").value(activeJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Chờ duyệt").value(pendingJobs).build(),
                DashboardStatsResponse.ChartData.builder().name("Đã đóng")
                        .value(jobPostingRepository.countByStatus(JobStatus.CLOSED)).build()
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
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));

        String actionLog;
        if (approve) {
            job.publish();
            actionLog = "APPROVE_JOB";
        } else {
            job.reject();
            actionLog = "REJECT_JOB";
        }

        jobPostingRepository.save(job);

        systemLogRepository.save(SystemLog.record(
                SYSTEM_ADMIN_ID,
                actionLog,
                "Job ID: " + jobId + (approve ? "" : ". Lý do: " + reason)
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminJobResponse> getPendingJobs() {
        return jobPostingRepository.findByStatus(JobStatus.PENDING).stream()
                .map(job -> {
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
                            .status(job.getStatus().name())
                            .createdAt(job.getCreatedAt())
                            .expiresAt(job.getExpiresAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void createSkillMasterData(MasterDataRequest request) {
        if (skillRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Kỹ năng '" + request.getName() + "' đã tồn tại.");
        }
        skillRepository.save(Skill.create(request.getName()));
        systemLogRepository.save(SystemLog.record(
                SYSTEM_ADMIN_ID, "CREATE_SKILL", "Tên: " + request.getName()
        ));
    }

    @Override
    public void deleteSkillMasterData(Long skillId) {
        skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Kỹ năng không tồn tại."));
        skillRepository.deleteById(skillId);
        systemLogRepository.save(SystemLog.record(
                SYSTEM_ADMIN_ID, "DELETE_SKILL", "Skill ID: " + skillId
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable) {
        DomainPage<SystemLog> page = systemLogRepository.findAll(pageable);
        return PageResponse.<SystemLogResponse>builder()
                .content(page.getContent().stream()
                        .map(log -> SystemLogResponse.builder()
                                .id(log.getId())
                                .userId(log.getUserId())
                                .action(log.getAction())
                                .details(log.getDetails())
                                .createdAt(log.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getPageNumber())
                .pageSize(page.getPageSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(DomainPageable pageable) {
        // 1. Lấy danh sách người dùng từ DB thông qua Repository
        DomainPage<User> page = userRepository.findAll(pageable);

        // 2. Chuyển đổi dữ liệu từ Entity (User) sang DTO (UserResponse) để gửi về Frontend
        List<UserResponse> content = page.getContent().stream().map(user -> {

            // ĐÃ SỬA: Dùng .value() thay vì String.valueOf() để lấy chuỗi email chuẩn
            String emailStr = user.getEmail() != null ? user.getEmail().value() : "Chưa cập nhật";

            // Tìm tên hiển thị dựa trên Role (Tùy chọn, Frontend có cơ chế fallback nếu null)
            String fullName = "Chưa cập nhật tên";
            if (user.getRole() != null) {
                if (user.getRole().name().equals("CANDIDATE")) {
                    fullName = candidateProfileRepository.findByUserId(user.getId())
                            .map(c -> c.getFullName()).orElse(fullName);
                } else if (user.getRole().name().equals("EMPLOYER")) {
                    fullName = companyProfileRepository.findByUserId(user.getId())
                            .map(c -> c.getCompanyName()).orElse(fullName);
                }
            }

            return UserResponse.builder()
                    .id(user.getId())
                    .email(emailStr)
                    .fullName(fullName)
                    .phone(user.getPhone() != null ? user.getPhone().value() : null)
                    .role(user.getRole())
                    .status(user.getStatus())
                    .build();
        }).collect(Collectors.toList());

        // 3. Đóng gói vào PageResponse
        return PageResponse.<UserResponse>builder()
                .content(content)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getPageNumber())
                .pageSize(page.getPageSize())
                .build();
    }

    @Override
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại."));
        user.ban();
        userRepository.save(user);
        systemLogRepository.save(SystemLog.record(SYSTEM_ADMIN_ID, "BAN_USER", "User ID: " + userId));
    }

    @Override
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại."));
        user.unban();
        userRepository.save(user);
        systemLogRepository.save(SystemLog.record(SYSTEM_ADMIN_ID, "UNBAN_USER", "User ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyProfileResponse> getPendingCompanies() {
        return companyProfileRepository.findByVerificationStatus(VerificationStatus.PENDING).stream()
                .map(profile -> CompanyProfileResponse.builder()
                        .id(profile.getId())
                        .userId(profile.getUserId())
                        .companyName(profile.getCompanyName())
                        .website(profile.getWebsite())
                        .description(profile.getDescription())
                        .logoUrl(profile.getLogoUrl())
                        .verificationStatus(profile.getVerificationStatus())
                        .likeCount(companyLikeRepository.countLikesByCompany(profile.getId()))
                        .isLiked(false)
                        .activeJobsCount(0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void moderateCompany(Long companyId, boolean approve, String reason) {
        CompanyProfile company = companyProfileRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy doanh nghiệp"));

        String actionLog;
        if (approve) {
            company.approve();
            actionLog = "APPROVE_COMPANY";
        } else {
            company.reject();
            actionLog = "REJECT_COMPANY";
        }

        companyProfileRepository.save(company);

        systemLogRepository.save(SystemLog.record(
                SYSTEM_ADMIN_ID,
                actionLog,
                "Company ID: " + companyId + (approve ? "" : ". Lý do: " + reason)
        ));
    }
}