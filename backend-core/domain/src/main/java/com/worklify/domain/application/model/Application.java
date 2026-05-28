package com.worklify.domain.application.model;

import com.worklify.domain.application.event.ApplicationSubmittedEvent;
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
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    @Builder.Default
    private final List<Object> domainEvents = new ArrayList<>();

    // Factory Method: Tạo đơn ứng tuyển mới
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

    // Business Behavior: Cập nhật trạng thái tự do (dùng cho các bước trong quy trình tuyển dụng)
    public void updateStatus(ApplicationStatus status) {
        this.status = status;
    }

    // Business Behavior: Employer/Admin chuyển sang đã xem xét
    public void markAsReviewed() {
        if (this.status != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể xem xét hồ sơ đang ở trạng thái PENDING.");
        }
        this.status = ApplicationStatus.REVIEWED;
    }

    // Business Behavior: Employer/Admin mời phỏng vấn
    public void scheduleInterview() {
        if (this.status != ApplicationStatus.REVIEWED) {
            throw new IllegalStateException("Chỉ có thể mời phỏng vấn hồ sơ đã được xem xét (REVIEWED).");
        }
        this.status = ApplicationStatus.INTERVIEW_SCHEDULED;
    }

    // Business Behavior: Chấp nhận ứng viên
    public void accept() {
        if (this.status == ApplicationStatus.REJECTED) {
            throw new IllegalStateException("Không thể chấp nhận một hồ sơ đã bị từ chối.");
        }
        if (this.status != ApplicationStatus.ACCEPTED) {
            this.status = ApplicationStatus.ACCEPTED;
        }
    }

    // Business Behavior: Từ chối ứng viên
    public void reject() {
        if (this.status == ApplicationStatus.ACCEPTED) {
            throw new IllegalStateException("Không thể từ chối một hồ sơ đã được chấp nhận.");
        }
        this.status = ApplicationStatus.REJECTED;
    }

    public void clearDomainEvents() {
        this.domainEvents.clear();
    }
}