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
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Business Behavior: Đóng tin tuyển dụng
    public void closeJob() {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Tin tuyển dụng này đã ở trạng thái đóng.");
        }
        this.status = JobStatus.CLOSED;
    }

    // Business Behavior: Gia hạn tin tuyển dụng
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