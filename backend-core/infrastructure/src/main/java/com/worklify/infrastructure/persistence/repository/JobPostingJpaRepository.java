package com.worklify.infrastructure.persistence.repository;

import com.worklify.domain.job.model.JobStatus;
import com.worklify.infrastructure.persistence.entity.JobPostingJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobPostingJpaRepository extends JpaRepository<JobPostingJpaEntity, Long> {

    Page<JobPostingJpaEntity> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    List<JobPostingJpaEntity> findByStatus(JobStatus status);

    List<JobPostingJpaEntity> findBySalaryMinIsNullAndSalaryMaxIsNullAndSalaryRangeIsNotNull();

    /**
     * Tìm tin đang mở. Lọc lương theo giao của hai khoảng: tin [min, max] khớp yêu cầu [salaryMin, salaryMax]
     * khi max_tin >= salaryMin và min_tin <= salaryMax (đầu khoảng null của tin coi như không giới hạn).
     * Khi có lọc lương, tin không có lương dạng số (thoả thuận) bị loại.
     */
    @Query("SELECT j FROM JobPostingJpaEntity j WHERE j.status = :status " +
            "AND (j.expiresAt IS NULL OR j.expiresAt > :now) " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(j.requirements) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:workType IS NULL OR j.workType = :workType) " +
            "AND (:salaryMin IS NULL OR COALESCE(j.salaryMax, j.salaryMin) >= :salaryMin) " +
            "AND (:salaryMax IS NULL OR COALESCE(j.salaryMin, j.salaryMax) <= :salaryMax) " +
            "ORDER BY j.createdAt DESC")
    Page<JobPostingJpaEntity> searchOpenJobs(@Param("keyword") String keyword,
                                             @Param("location") String location,
                                             @Param("workType") String workType,
                                             @Param("salaryMin") Integer salaryMin,
                                             @Param("salaryMax") Integer salaryMax,
                                             @Param("status") JobStatus status,
                                             @Param("now") LocalDateTime now,
                                             Pageable pageable);

    @Query("SELECT j FROM JobPostingJpaEntity j WHERE j.companyId = :companyId AND j.status = :status " +
            "AND (j.expiresAt IS NULL OR j.expiresAt > :now) ORDER BY j.createdAt DESC")
    Page<JobPostingJpaEntity> findOpenByCompany(@Param("companyId") Long companyId,
                                                @Param("status") JobStatus status,
                                                @Param("now") LocalDateTime now,
                                                Pageable pageable);

    @Query("SELECT COUNT(j) FROM JobPostingJpaEntity j WHERE j.companyId = :companyId AND j.status = :status " +
            "AND (j.expiresAt IS NULL OR j.expiresAt > :now)")
    long countOpenByCompany(@Param("companyId") Long companyId,
                            @Param("status") JobStatus status,
                            @Param("now") LocalDateTime now);

    long countByStatus(JobStatus status);
}
