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

    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;

    public static JobPosting createDraft(Long companyId, String title, String description,
                                         String requirements, String salaryRange, String location,
                                         LocalDateTime expiredAt) {
        if (companyId == null || title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Dữ liệu tin tuyển dụng không hợp lệ.");
        }
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
                              String salaryRange, String location, LocalDateTime expiredAt) {
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.location = location;
        this.expiredAt = expiredAt;
    }
}