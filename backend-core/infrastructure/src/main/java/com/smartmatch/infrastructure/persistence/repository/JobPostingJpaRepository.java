package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.infrastructure.persistence.entity.JobPostingJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingJpaRepository extends JpaRepository<JobPostingJpaEntity, Long> {

    // [ĐÃ SỬA] Dùng Page thay cho List đối với các truy vấn lớn để Mapper có thể chuyển thành DomainPage
    Page<JobPostingJpaEntity> findByCompanyId(Long companyId, Pageable pageable);

    List<JobPostingJpaEntity> findByStatus(JobStatus status);

    // [ĐÃ SỬA] Phục hồi phương thức searchJobs cực kỳ quan trọng
    @Query("SELECT j FROM JobPostingJpaEntity j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "j.status = :status")
    Page<JobPostingJpaEntity> searchJobs(@Param("keyword") String keyword,
                                         @Param("location") String location,
                                         @Param("status") JobStatus status,
                                         Pageable pageable);
}
