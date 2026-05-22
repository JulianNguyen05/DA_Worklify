package com.smartmatch.domain.application.model;

import com.smartmatch.domain.application.event.ApplicationSubmittedEvent;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Application {
    private Long id;
    private Long candidateId;
    private Long jobId;
    private Long cvId;

    // Các trường bổ sung để khớp với JobApplicationServiceImpl
    private String coverLetter;
    private String blindTestToken;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    // Danh sách lưu trữ các sự kiện miền phát sinh từ Entity này
    @Builder.Default
    private final List<Object> domainEvents = new ArrayList<>();

    // Business Behavior: Khởi tạo ứng tuyển (Đã sửa thành createNew để khớp với Service)
    public static Application createNew(Long jobId, Long cvId, Long candidateId, String coverLetter) {
        Application application = Application.builder()
                .jobId(jobId)
                .cvId(cvId)
                .candidateId(candidateId)
                .coverLetter(coverLetter)
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        application.domainEvents.add(new ApplicationSubmittedEvent(
                application.getId(), candidateId, jobId, application.getAppliedAt()
        ));
        return application;
    }

    // Business Behavior: Cập nhật trạng thái tự do
    public void updateStatus(ApplicationStatus status) {
        this.status = status;
    }

    // Business Behavior: Kích hoạt Blind Testing (Tạo URL ẩn danh trung lập)
    public void enableBlindTesting() {
        String token = UUID.randomUUID().toString();
        // Cấu hình URL sử dụng sub-domain trung lập để đánh giá khách quan
        this.blindTestToken = "https://appa.ungdungnghiencuu.com/review/candidate/" + token;
    }

    // Business Behavior: Phê duyệt hồ sơ
    public void approve() {
        if (this.status == ApplicationStatus.REJECTED) {
            throw new IllegalStateException("Không thể duyệt một hồ sơ đã bị từ chối.");
        }
        if (this.status != ApplicationStatus.APPROVED) {
            this.status = ApplicationStatus.APPROVED;
            // Có thể thêm ApplicationApprovedEvent vào danh sách domainEvents tại đây
        }
    }

    // Business Behavior: Từ chối hồ sơ
    public void reject() {
        if (this.status == ApplicationStatus.APPROVED) {
            throw new IllegalStateException("Không thể từ chối một hồ sơ đã được phê duyệt.");
        }
        this.status = ApplicationStatus.REJECTED;
    }

    public void clearDomainEvents() {
        this.domainEvents.clear();
    }
}