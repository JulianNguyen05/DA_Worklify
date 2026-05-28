package com.smartmatch.application.admin.service;

import com.smartmatch.application.admin.dto.AdminJobResponse;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.auth.dto.UserResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.worklify.domain.common.DomainPageable;

import java.util.List;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();

    // Sửa dòng cũ thành dòng này:
    void moderateJob(Long jobId, boolean approve, String reason);

    // Quản lý Master Data
    void createSkillMasterData(MasterDataRequest request);
    void deleteSkillMasterData(Long skillId);

    PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable);
    PageResponse<UserResponse> getAllUsers(DomainPageable pageable);

    void banUser(Long userId);
    void unbanUser(Long userId);

    List<CompanyProfileResponse> getPendingCompanies();

    // Chỉ giữ lại DUY NHẤT hàm 3 tham số này cho việc kiểm duyệt công ty
    void moderateCompany(Long companyId, boolean approve, String reason);

    // Thêm hàm này vào interface
    List<AdminJobResponse> getPendingJobs();
}