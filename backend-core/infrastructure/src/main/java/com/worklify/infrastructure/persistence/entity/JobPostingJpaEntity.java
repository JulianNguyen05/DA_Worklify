package com.worklify.infrastructure.persistence.entity;

import com.worklify.domain.job.model.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [ĐÃ SỬA] Bổ sung field workType bị thiếu, khớp với cột work_type trong bảng job_postings (init.sql)
 * và field workType trong domain model JobPosting.
 */
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

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "salary_range", length = 100)
    private String salaryRange;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "work_type", length = 50)
    private String workType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private JobStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}