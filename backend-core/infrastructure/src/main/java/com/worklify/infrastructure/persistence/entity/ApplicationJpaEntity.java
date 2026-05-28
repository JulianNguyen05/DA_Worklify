package com.worklify.infrastructure.persistence.entity;

import com.worklify.domain.application.model.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [ĐÃ SỬA] Xóa field blindTestUrl vì cột này không tồn tại trong init.sql (bảng applications).
 * Nếu sau này cần tính năng blind test, cần bổ sung migration DB trước.
 * UniqueConstraint giữ nguyên để chống nộp đơn trùng.
 */
@Entity
@Table(name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "candidate_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "cv_id")
    private Long cvId;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;
}