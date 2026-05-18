package com.smartmatch.application.jobapplication.dto;

import com.smartmatch.domain.application.model.ApplicationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin đơn ứng tuyển")
public class ApplicationResponse {

    @Schema(description = "ID đơn ứng tuyển", example = "1")
    private Long id;

    @Schema(description = "ID công việc", example = "100")
    private Long jobId;

    @Schema(description = "ID ứng viên", example = "5")
    private Long candidateId;

    @Schema(description = "ID CV đã nộp", example = "50")
    private Long cvId;

    @Schema(description = "Thư giới thiệu")
    private String coverLetter;

    @Schema(description = "Trạng thái hồ sơ", example = "PENDING")
    private ApplicationStatus status;

    @Schema(description = "Thời gian nộp hồ sơ")
    private LocalDateTime appliedAt;

    @Schema(description = "Kết quả phân tích AI (Nếu đã được quét)")
    private AiMatchScoreResponse aiScore;
}