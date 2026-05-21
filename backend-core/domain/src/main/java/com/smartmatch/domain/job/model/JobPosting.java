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

    public static JobPosting createDraft(Long companyId, String title, String description, LocalDateTime expiredAt) {
        if (companyId == null || title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Dữ liệu tin tuyển dụng không hợp lệ.");
        }
        return JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiredAt(expiredAt)
                .build();
    }

    public void publish() {
        this.status = JobStatus.ACTIVE;
    }

    public void close() {
        this.status = JobStatus.CLOSED;
    }

    public void reject() {
        this.status = JobStatus.REJECTED;
    }

    public void updateDetails(String title, String description, LocalDateTime expiredAt) {
        this.title = title;
        this.description = description;
        this.expiredAt = expiredAt;
    }
}