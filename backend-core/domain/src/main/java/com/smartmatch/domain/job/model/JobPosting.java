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
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;

    /**
     * Hành vi: Công ty xuất bản tin tuyển dụng.
     */
    public void publish() {
        if (this.title == null || this.description == null) {
            throw new IllegalStateException("Tin tuyển dụng thiếu thông tin bắt buộc.");
        }
        this.status = JobStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Hành vi: Đóng tin tuyển dụng (có thể do đã đủ người hoặc hết hạn).
     */
    public void closeJob() {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Tin tuyển dụng này đã được đóng trước đó.");
        }
        this.status = JobStatus.CLOSED;
    }

    /**
     * Kiểm tra tin tuyển dụng còn hạn hay không.
     */
    public boolean isExpired() {
        return this.expiredAt != null && LocalDateTime.now().isAfter(this.expiredAt);
    }
}