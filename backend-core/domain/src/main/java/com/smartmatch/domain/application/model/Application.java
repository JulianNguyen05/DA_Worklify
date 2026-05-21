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

    // Thuộc tính phục vụ kiểm thử mù (Blind Testing)
    private String blindTestUrl;

    /**
     * Factory method để khởi tạo một Đơn ứng tuyển mới.
     * Đảm bảo trạng thái mặc định luôn đúng và dữ liệu hợp lệ.
     */
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

    /**
     * Nghiệp vụ: Chuyển trạng thái đơn sang Đang xem xét.
     */
    public void markAsReviewed() {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể review hồ sơ đang ở trạng thái PENDING.");
        }
        this.status = ApplicationStatus.REVIEWED;
    }

    /**
     * Nghiệp vụ: Chấp nhận ứng viên.
     */
    public void accept() {
        this.status = ApplicationStatus.ACCEPTED;
    }

    /**
     * Nghiệp vụ: Sinh liên kết ẩn danh cho hội đồng đánh giá.
     * Ẩn toàn bộ định danh ứng viên, điều hướng qua sub-domain trung lập.
     */
    public void enableBlindTesting() {
        String uniqueMask = UUID.randomUUID().toString().substring(0, 12);
        // Sử dụng sub-domain trung lập để che giấu nguồn gốc hệ thống đối với hội đồng
        this.blindTestUrl = String.format("https://appa.ungdungnghiencuu.com/review/%s", uniqueMask);
    }
}