package com.worklify.infrastructure.persistence.repository;

import com.worklify.domain.job.model.JobStatus;
import com.worklify.infrastructure.persistence.entity.JobPostingJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingJpaRepository extends JpaRepository<JobPostingJpaEntity, Long> {

    Page<JobPostingJpaEntity> findByCompanyId(Long companyId, Pageable pageable);

    List<JobPostingJpaEntity> findByStatus(JobStatus status);

    @Query("SELECT j FROM JobPostingJpaEntity j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "j.status = :status")
    Page<JobPostingJpaEntity> searchJobs(@Param("keyword") String keyword,
                                         @Param("location") String location,
                                         @Param("status") JobStatus status,
                                         Pageable pageable);

    long countByStatus(JobStatus status);
}