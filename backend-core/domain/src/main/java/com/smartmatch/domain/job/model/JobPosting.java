// Sửa file: \backend-core\domain\src\main\java\com\smartmatch\domain\job\model\JobPosting.java
package com.smartmatch.domain.job.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Thực thể (Entity) đại diện cho Tin tuyển dụng.
 * Thuộc Bounded Context: Job (Miền Tuyển dụng).
 * Map với Bảng 3-7: Bảng job_postings trong Data Dictionary.
 */
@Entity
@Table(name = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {

    /**
     * Khóa chính định danh tin tuyển dụng.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Khóa ngoại tham chiếu đến company_profiles(id).
     */
    @Column(name = "company_id", nullable = false)
    private Long companyId;

    /**
     * Tiêu đề vị trí công việc.
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Mô tả chi tiết nhiệm vụ công việc.
     */
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    // ... (Thêm comment tương tự cho các trường còn lại)

    /**
     * Trạng thái tin (PENDING, ACTIVE, CLOSED, REJECTED).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status;

    /**
     * Ngày giờ đăng tải tin lên hệ thống (Không cho phép update sau khi tạo).
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Ngày giờ hết hạn nhận đơn ứng tuyển.
     */
    @Column(name = "expired_at")
    private LocalDateTime expiredAt;
}