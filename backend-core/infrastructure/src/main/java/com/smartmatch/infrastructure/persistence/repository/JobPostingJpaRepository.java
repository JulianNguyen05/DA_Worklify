package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.infrastructure.persistence.entity.JobPostingJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingJpaRepository extends JpaRepository<JobPostingJpaEntity, Long> {
    // [ĐÃ SỬA] Trả về List thay vì Page để khớp với Port của Domain
    List<JobPostingJpaEntity> findByCompanyId(Long companyId);
    List<JobPostingJpaEntity> findByStatus(JobStatus status);
}
