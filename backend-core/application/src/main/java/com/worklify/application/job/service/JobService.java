package com.worklify.application.job.service;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.dto.SavedJobResponse;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobSearchFilter;

import java.util.List;

public interface JobService {
    JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request);
    JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request);
    JobPostingResponse closeJobPosting(Long companyId, Long jobId);
    /** Chi tiết tin cho người xem (email null = khách). Tin chưa duyệt/bị từ chối chỉ chủ tin hoặc admin xem được. */
    JobPostingResponse getJobForViewer(Long jobId, String viewerEmail);
    PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable);
    PageResponse<JobPostingResponse> searchJobs(JobSearchFilter filter, DomainPageable pageable);
    void saveJobForCandidate(Long candidateId, Long jobId);
    void unsaveJobForCandidate(Long candidateId, Long jobId);
    PageResponse<SavedJobResponse> getSavedJobsByCandidate(Long candidateId, DomainPageable pageable);
    List<Long> getSavedJobIds(Long candidateId);
    PageResponse<JobPostingResponse> getPublicJobsByCompany(Long companyId, DomainPageable pageable);
}
