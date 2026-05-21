package com.smartmatch.application.admin.service;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.MasterDataRequest;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobStatus;

public interface AdminService {
    void logAction(Long userId, String action, String details);
    PageResponse<SystemLogResponse> getSystemLogs(DomainPageable pageable);
    PageResponse<SystemLogResponse> getLogsByUser(Long userId, DomainPageable pageable);
    DashboardStatsResponse getDashboardStatistics();
    void moderateJobPosting(Long adminId, Long jobId, JobStatus newStatus, String reason);

    // Master Data Management
    void addSkillMasterData(MasterDataRequest request);
    void updateSkillMasterData(Long skillId, MasterDataRequest request);
    void deleteSkillMasterData(Long skillId);
}