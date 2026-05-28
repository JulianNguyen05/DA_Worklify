package com.smartmatch.application.jobapplication.service;
import com.smartmatch.application.jobapplication.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.application.model.ApplicationStatus;

public interface JobApplicationService {
    ApplicationResponse applyJob(Long candidateId, ApplicationRequest request);
    PageResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, DomainPageable pageable);

    // Đảm bảo tính minh bạch - Trả về luồng dữ liệu ẩn danh cho hội đồng đánh giá sơ tuyển
    PageResponse<ApplicationResponse> getApplicationsForReviewBoard(Long jobId, DomainPageable pageable);

    void updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status);

    // Xử lý bất đồng bộ (Event-Driven Async via Message Broker) chống nghẽn hệ thống (5-8s ML Process)
    void triggerAiMatchingAsync(Long applicationId);
    AiMatchScoreResponse getAiMatchResult(Long applicationId);
}