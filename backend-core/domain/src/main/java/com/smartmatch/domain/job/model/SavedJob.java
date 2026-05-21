// File: \backend-core\domain\src\main\java\com\smartmatch\domain\job\model\SavedJob.java
package com.smartmatch.domain.job.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SavedJob {
    private Long id;
    private Long candidateId;
    private Long jobId;
    private LocalDateTime savedAt;

    /**
     * Factory method: Ứng viên lưu tin tuyển dụng.
     */
    public static SavedJob markAsSaved(Long candidateId, Long jobId) {
        if (candidateId == null || jobId == null) {
            throw new IllegalArgumentException("Thông tin lưu việc làm không hợp lệ.");
        }
        return SavedJob.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .savedAt(LocalDateTime.now())
                .build();
    }
}