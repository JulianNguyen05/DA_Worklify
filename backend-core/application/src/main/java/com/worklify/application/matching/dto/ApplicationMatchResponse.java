package com.worklify.application.matching.dto;

import com.worklify.domain.application.model.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Một hồ sơ ứng tuyển kèm điểm phù hợp AI, dùng cho màn hình xếp hạng ứng viên của nhà tuyển dụng.
 */
@Data
@Builder
public class ApplicationMatchResponse {
    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    /** null khi không chấm được (vd ứng viên chưa có hồ sơ online) — lý do nằm ở {@link #note}. */
    private CvJdScoreResponse match;
    private String note;
}
