package com.smartmatch.application.admin.service;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.auth.dto.UserResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobStatus;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    void moderateJob(Long jobId, JobStatus status);
    void moderateCompany(Long companyId, boolean approve);

    // Quản lý Master Data
    void createSkillMasterData(MasterDataRequest request);
    void deleteSkillMasterData(Long skillId);

    // [ĐÃ SỬA] Bổ sung các tính năng bị thiếu
    PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable);
    PageResponse<UserResponse> getAllUsers(DomainPageable pageable);
    void banUser(Long userId);
    void unbanUser(Long userId);
}