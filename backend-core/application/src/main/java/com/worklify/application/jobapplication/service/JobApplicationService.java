package com.worklify.application.jobapplication.service;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.jobapplication.dto.ApplicationRequest;
import com.worklify.application.jobapplication.dto.ApplicationResponse;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.application.model.ApplicationStatus;

public interface JobApplicationService {
    ApplicationResponse applyJob(Long candidateId, ApplicationRequest request);
    PageResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, DomainPageable pageable);

    // Đảm bảo tính minh bạch - Trả về luồng dữ liệu ẩn danh cho hội đồng đánh giá sơ tuyển
    PageResponse<ApplicationResponse> getApplicationsForReviewBoard(Long jobId, DomainPageable pageable);

    void updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status);
    ApplicationResponse getApplicationById(Long id);
}