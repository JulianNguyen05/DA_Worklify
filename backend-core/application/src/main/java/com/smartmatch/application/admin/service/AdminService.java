package com.smartmatch.application.admin.service;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobStatus;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    void moderateJob(Long jobId, JobStatus status);
    void moderateCompany(Long companyId, boolean approve);

    // Hệ thống Quản trị Danh mục chuẩn hóa tìm kiếm dữ liệu tĩnh (Master Data Management)
    void createSkillMasterData(MasterDataRequest request);
    void deleteSkillMasterData(Long skillId);
}