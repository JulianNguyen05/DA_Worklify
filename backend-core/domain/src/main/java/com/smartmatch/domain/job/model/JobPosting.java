// File: \backend-core\domain\src\main\java\com\smartmatch\domain\job\model\JobPosting.java
package com.smartmatch.domain.job.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class JobPosting {
    private Long id;
    private Long companyId;
    private String title;
    private String description;

    private String requirements;
    private String salaryRange;
    private String location;
    private String workType; // Đã giữ lại thuộc tính này để đồng bộ

    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;

    /**
     * Phương thức khởi tạo một tin tuyển dụng mới từ nhà tuyển dụng.
     * Trạng thái mặc định ban đầu là PENDING (Chờ kiểm duyệt từ Admin).
     */
    public static JobPosting createNewJob(Long companyId, String title, String description,
                                          String requirements, String salaryRange, String location,
                                          String workType, LocalDateTime expiredAt) {
        validateRequiredFields(companyId, title);

        if (expiredAt != null && expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Thời hạn tin tuyển dụng phải ở trong tương lai.");
        }

        return JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .requirements(requirements)
                .salaryRange(salaryRange)
                .location(location)
                .workType(workType)
                .status(JobStatus.PENDING) // Hoặc DRAFT tùy thuộc quy trình nghiệp vụ của bạn
                .createdAt(LocalDateTime.now())
                .expiredAt(expiredAt)
                .build();
    }

    /**
     * Giữ lại phương thức cũ nếu các module khác hoặc testcase đang sử dụng
     */
    public static JobPosting createDraft(Long companyId, String title, String description,
                                         String requirements, String salaryRange, String location,
                                         LocalDateTime expiredAt) {
        validateRequiredFields(companyId, title);
        return JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .requirements(requirements)
                .salaryRange(salaryRange)
                .location(location)
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiredAt(expiredAt)
                .build();
    }

    // Các phương thức hành vi của Domain (Domain Behaviors)
    public void publish() {
        this.status = JobStatus.ACTIVE;
    }

    public void close() {
        this.status = JobStatus.CLOSED;
    }

    public void reject() {
        this.status = JobStatus.REJECTED;
    }

    public void updateDetails(String title, String description, String requirements,
                              String salaryRange, String location, String workType, LocalDateTime expiredAt) {
        validateRequiredFields(this.companyId, title);
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.location = location;
        this.workType = workType;
        this.expiredAt = expiredAt;
    }

    // Tách luật kiểm tra dữ liệu đầu vào (Invariants) ra hàm dùng chung
    private static void validateRequiredFields(Long companyId, String title) {
        if (companyId == null) {
            throw new IllegalArgumentException("Mã doanh nghiệp không được để trống.");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề tin tuyển dụng không được để trống.");
        }
    }
}