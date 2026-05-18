package com.smartmatch.application.jobapplication.dto;

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
@Schema(description = "Kết quả phân tích mức độ phù hợp từ AI")
public class AiMatchScoreResponse {

    @Schema(description = "Điểm số tương thích (%)", example = "85.5")
    private Float confidenceScore;

    @Schema(description = "Chi tiết phân tích (JSON string hoặc Text)", example = "Khớp kỹ năng: Java, Spring Boot. Thiếu: AWS.")
    private String analysisDetails;

    @Schema(description = "Thời điểm hệ thống AI hoàn tất đánh giá")
    private LocalDateTime evaluatedAt;
}