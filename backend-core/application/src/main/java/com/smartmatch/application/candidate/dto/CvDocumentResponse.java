package com.smartmatch.application.candidate.dto;

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
@Schema(description = "Thông tin tài liệu CV")
public class CvDocumentResponse {

    @Schema(description = "ID tài liệu CV", example = "1")
    private Long id;

    @Schema(description = "ID hồ sơ ứng viên sở hữu CV", example = "3")
    private Long candidateId;

    @Schema(description = "Đường dẫn lưu trữ file CV trên server", example = "/uploads/cv/cv_1.pdf")
    private String filePath;

    @Schema(description = "Văn bản thô được trích xuất từ CV (phục vụ AI)")
    private String rawText;

    @Schema(description = "CV tạo từ biểu mẫu (true) hay tải lên file (false)", example = "false")
    private Boolean isGenerated;

    @Schema(description = "Thời điểm tạo/tải lên CV")
    private LocalDateTime createdAt;
}