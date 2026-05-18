package com.smartmatch.application.admin.dto;

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
@Schema(description = "Nhật ký hệ thống")
public class SystemLogResponse {

    @Schema(description = "ID log", example = "1")
    private Long id;

    @Schema(description = "ID user thực hiện (có thể null nếu là hệ thống/guest)", example = "10")
    private Long userId;

    @Schema(description = "Hành động", example = "APPROVE_JOB")
    private String action;

    @Schema(description = "Chi tiết", example = "Duyệt tin tuyển dụng ID 100")
    private String details;

    @Schema(description = "Thời gian ghi nhận")
    private LocalDateTime createdAt;
}