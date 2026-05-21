package com.smartmatch.application.admin.service.impl;

import com.smartmatch.application.admin.dto.*;
import com.smartmatch.application.admin.service.AdminService;
import com.smartmatch.application.auth.dto.UserResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.admin.model.SystemLog;
import com.smartmatch.domain.admin.repository.SystemLogRepository;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final SystemLogRepository systemLogRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .activeJobs(jobPostingRepository.countByStatus(JobStatus.ACTIVE))
                .totalApplications(0) // Cần tích hợp thêm ApplicationRepository
                .build();
    }

    @Override
    public void moderateJob(Long jobId, JobStatus status) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));

        if (status == JobStatus.ACTIVE) {
            job.publish();
        } else if (status == JobStatus.REJECTED) {
            job.reject();
        }

        jobPostingRepository.save(job);
        systemLogRepository.save(SystemLog.record(null, "MODERATE_JOB", "Job ID: " + jobId + " status: " + status));
    }

    @Override
    public void moderateCompany(Long companyId, boolean approve) {
        // Implement logic duyệt công ty
    }

    @Override
    public void createSkillMasterData(MasterDataRequest request) {
        // Implement logic thêm danh mục Skill
    }

    @Override
    public void deleteSkillMasterData(Long skillId) {
        // Implement logic xóa Skill
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable) {
        DomainPage<SystemLog> page = systemLogRepository.findAll(pageable);

        return PageResponse.<SystemLogResponse>builder()
                .content(page.getContent().stream().map(log -> SystemLogResponse.builder()
                        .id(log.getId())
                        .action(log.getAction())
                        .details(log.getDetails())
                        .createdAt(log.getCreatedAt())
                        .build()).collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(DomainPageable pageable) {
        // Logic lấy danh sách User theo phân trang
        return PageResponse.<UserResponse>builder().build();
    }

    @Override
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        user.ban();
        userRepository.save(user);
    }

    @Override
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        user.unban();
        userRepository.save(user);
    }
}