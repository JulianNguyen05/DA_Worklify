package com.smartmatch.domain.job.repository;

import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface JobPostingRepository {
    JobPosting save(JobPosting jobPosting);
    Optional<JobPosting> findById(Long id);
    List<JobPosting> findAll();
    void deleteById(Long id);
    Page<JobPosting> findByCompanyId(Long companyId, Pageable pageable);
    Page<JobPosting> findByStatus(JobStatus status, Pageable pageable);
    Page<JobPosting> searchJobs(String keyword, String location, JobStatus status, Pageable pageable);
    long countByStatus(JobStatus status);
}