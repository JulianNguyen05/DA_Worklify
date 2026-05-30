// File: \backend-core\application\src\main\java\com\smartmatch\application\job\service\JobService.java
package com.worklify.application.job.service;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.dto.SavedJobResponse;
import com.worklify.domain.common.DomainPageable;

public interface JobService {
    JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request);
    JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request);
    JobPostingResponse getJobById(Long jobId);
    PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable);
    PageResponse<JobPostingResponse> searchJobs(String keyword, String location, DomainPageable pageable);
    void saveJobForCandidate(Long candidateId, Long jobId);
    void unsaveJobForCandidate(Long candidateId, Long jobId);
    PageResponse<SavedJobResponse> getSavedJobsByCandidate(Long candidateId, DomainPageable pageable);
    PageResponse<JobPostingResponse> getPublicJobsByCompany(Long companyId, DomainPageable pageable);
}