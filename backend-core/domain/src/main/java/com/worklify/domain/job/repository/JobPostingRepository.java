package com.worklify.domain.job.repository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobStatus;

import java.util.List;
import java.util.Optional;
public interface JobPostingRepository {
    JobPosting save(JobPosting jobPosting);
    Optional<JobPosting> findById(Long id);
    DomainPage<JobPosting> findByCompanyId(Long companyId, DomainPageable pageable);
    DomainPage<JobPosting> searchJobs(String keyword, String location, JobStatus status, DomainPageable pageable);
    List<JobPosting> findByStatus(JobStatus status);
    long countByStatus(JobStatus status);
    DomainPage<JobPosting> findByCompanyIdAndStatus(Long companyId, JobStatus status, DomainPageable pageable);
}