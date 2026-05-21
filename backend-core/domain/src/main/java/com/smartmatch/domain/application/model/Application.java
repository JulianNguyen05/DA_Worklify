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
    private String blindTestUrl; // Tích hợp cơ chế kiểm thử mù (Blind Testing)

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
        // Sinh mã token ẩn danh hóa danh tính ứng viên
        String uniqueMask = UUID.randomUUID().toString().substring(0, 12);
        // Điều hướng thông tin qua sub-domain trung lập bảo mật chống định kiến sơ tuyển
        this.blindTestUrl = String.format("https://appa.ungdungnghiencuu.com/review/%s", uniqueMask);
    }
}