package com.smartmatch.application.job.service;
import com.smartmatch.application.job.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobStatus;

public interface JobService {
    JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request);
    JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request);
    JobPostingResponse getJobById(Long jobId);
    PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable);
    PageResponse<JobPostingResponse> searchJobs(String keyword, String location, DomainPageable pageable);
}