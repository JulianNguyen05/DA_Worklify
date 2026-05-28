package com.worklify.domain.job.model;

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
    private String workType;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Factory Method: Tạo tin tuyển dụng mới, mặc định ở trạng thái PENDING chờ Admin duyệt
    public static JobPosting createNewJob(Long companyId, String title, String description,
                                          String requirements, String salaryRange,
                                          String location, String workType, LocalDateTime expiresAt) {
        if (companyId == null || title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Thiếu thông tin bắt buộc để tạo tin tuyển dụng.");
        }
        return JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .requirements(requirements)
                .salaryRange(salaryRange)
                .location(location)
                .workType(workType)
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .build();
    }

    // Business Behavior: Employer cập nhật tin → tự động về PENDING để Admin kiểm duyệt lại
    public void updateDetails(String title, String description, String requirements,
                              String salaryRange, String location, String workType, LocalDateTime expiresAt) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề công việc không được để trống.");
        }
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.location = location;
        this.workType = workType;
        this.expiresAt = expiresAt;
        this.status = JobStatus.PENDING;
    }

    // Business Behavior: Admin duyệt tin
    public void publish() {
        if (this.status != JobStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể duyệt tin đang ở trạng thái PENDING.");
        }
        this.status = JobStatus.ACTIVE;
    }

    // Business Behavior: Admin từ chối tin
    public void reject() {
        if (this.status != JobStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể từ chối tin đang ở trạng thái PENDING.");
        }
        this.status = JobStatus.REJECTED;
    }

    // Business Behavior: Employer/Admin đóng tin
    public void closeJob() {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Tin tuyển dụng này đã ở trạng thái đóng.");
        }
        this.status = JobStatus.CLOSED;
    }

    // Business Behavior: Gia hạn ngày hết hạn
    public void extendExpirationDate(int daysToAdd) {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Không thể gia hạn một tin tuyển dụng đã đóng.");
        }
        if (daysToAdd <= 0) {
            throw new IllegalArgumentException("Số ngày gia hạn phải lớn hơn 0.");
        }
        this.expiresAt = this.expiresAt.plusDays(daysToAdd);
    }
}