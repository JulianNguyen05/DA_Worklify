package com.smartmatch.domain.job.repository;

import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;

import java.util.List;
import java.util.Optional;

public interface JobPostingRepository {
    JobPosting save(JobPosting jobPosting);
    Optional<JobPosting> findById(Long id);
    List<JobPosting> findAll();
    void deleteById(Long id);
    DomainPage<JobPosting> findByCompanyId(Long companyId, DomainPageable pageable);
    DomainPage<JobPosting> findByStatus(JobStatus status, DomainPageable pageable);
    DomainPage<JobPosting> searchJobs(String keyword, String location, JobStatus status, DomainPageable pageable);
    long countByStatus(JobStatus status);
}