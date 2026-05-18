package com.smartmatch.application.job.dto;

import com.smartmatch.domain.job.model.JobStatus;
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
@Schema(description = "Thông tin chi tiết tin tuyển dụng")
public class JobPostingResponse {

    @Schema(description = "ID tin tuyển dụng", example = "1")
    private Long id;

    @Schema(description = "ID công ty đăng tuyển", example = "10")
    private Long companyId;

    @Schema(description = "Tiêu đề vị trí tuyển dụng", example = "Senior Java Backend Developer")
    private String title;

    @Schema(description = "Mô tả công việc")
    private String description;

    @Schema(description = "Yêu cầu kỹ năng")
    private String requirements;

    @Schema(description = "Khoảng mức lương dự kiến", example = "20 - 35 triệu VNĐ")
    private String salaryRange;

    @Schema(description = "Địa điểm làm việc", example = "TP. Hồ Chí Minh")
    private String location;

    @Schema(description = "Trạng thái tin đăng", example = "ACTIVE")
    private JobStatus status;

    @Schema(description = "Thời gian đăng tải")
    private LocalDateTime createdAt;

    @Schema(description = "Thời gian hết hạn")
    private LocalDateTime expiredAt;
}