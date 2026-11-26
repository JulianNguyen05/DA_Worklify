package com.worklify.domain.job.repository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobSearchFilter;
import com.worklify.domain.job.model.JobStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface JobPostingRepository {
    JobPosting save(JobPosting jobPosting);
    Optional<JobPosting> findById(Long id);
    DomainPage<JobPosting> findByCompanyId(Long companyId, DomainPageable pageable);
    /** Tin ACTIVE, chưa hết hạn tại thời điểm now, khớp bộ lọc; mới nhất trước. */
    DomainPage<JobPosting> searchOpenJobs(JobSearchFilter filter, LocalDateTime now, DomainPageable pageable);
    List<JobPosting> findByStatus(JobStatus status);
    long countByStatus(JobStatus status);
    /** Tin ACTIVE, chưa hết hạn của một công ty. */
    DomainPage<JobPosting> findOpenJobsByCompany(Long companyId, LocalDateTime now, DomainPageable pageable);
    long countOpenJobsByCompany(Long companyId, LocalDateTime now);
}
