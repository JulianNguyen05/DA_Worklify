package com.smartmatch.application.jobapplication.service;
import com.smartmatch.application.jobapplication.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.application.model.ApplicationStatus;

public interface JobApplicationService {
    ApplicationResponse applyForJob(Long candidateId, ApplicationRequest request);
    PageResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, DomainPageable pageable);

    // Lấy danh sách hồ sơ cho hội đồng (chỉ trả về blindTestUrl, ẩn danh định dạng ứng viên)
    PageResponse<ApplicationResponse> getApplicationsForReviewBoard(Long companyId, Long jobId, DomainPageable pageable);

    ApplicationResponse getApplicationDetail(Long applicationId);
    void updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status);

    // Đẩy message (Event) vào Message Broker (Kafka/RabbitMQ) thay vì gọi đồng bộ
    void triggerAiMatchingAsync(Long applicationId);

    AiMatchScoreResponse getAiMatchResult(Long applicationId);
}