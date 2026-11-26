package com.worklify.application.jobapplication.service;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.jobapplication.dto.ApplicationRequest;
import com.worklify.application.jobapplication.dto.ApplicationResponse;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.common.DomainPageable;

public interface JobApplicationService {
    ApplicationResponse applyJob(Long candidateId, ApplicationRequest request);
    PageResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, DomainPageable pageable);

    PageResponse<ApplicationResponse> getApplicationsForReviewBoard(Long jobId, DomainPageable pageable);

    ApplicationResponse updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status);

    ApplicationResponse getApplicationById(Long id);

    /** Ứng viên rút đơn (chỉ khi đơn còn PENDING). */
    void withdrawApplication(Long candidateId, Long applicationId);
}
