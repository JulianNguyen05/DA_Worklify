// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\persistence\entity\JobPostingJpaEntity.java
package com.smartmatch.infrastructure.persistence.entity;

import com.smartmatch.domain.job.model.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String requirements;

    @Column(name = "salary_range", length = 100)
    private String salaryRange;

    @Column(nullable = false, length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Sửa @Column name và tên biến
    @Column(name = "expired_at", nullable = false) // Tên cột DB vẫn giữ nguyên để không phải sửa lại bảng
    private LocalDateTime expiresAt; // Đổi từ expiredAt -> expiresAt
}
