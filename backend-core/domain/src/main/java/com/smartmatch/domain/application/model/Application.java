// File: domain/src/main/java/com/smartmatch/domain/application/model/Application.java
package com.smartmatch.domain.application.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Application {
    private Long id;
    private Long jobId;
    private Long cvId;
    private Long candidateId;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    private String blindTestToken;

    public static Application createNew(Long jobId, Long cvId, Long candidateId, String coverLetter) {
        if (jobId == null || cvId == null || candidateId == null) {
            throw new IllegalArgumentException("Thông tin ứng tuyển không được để trống");
        }
        return Application.builder()
                .jobId(jobId)
                .cvId(cvId)
                .candidateId(candidateId)
                .coverLetter(coverLetter)
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();
    }

    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }

    public void enableBlindTesting() {
        // Domain chỉ chịu trách nhiệm sinh chuỗi định danh ngẫu nhiên
        this.blindTestToken = UUID.randomUUID().toString().substring(0, 12);
    }
}