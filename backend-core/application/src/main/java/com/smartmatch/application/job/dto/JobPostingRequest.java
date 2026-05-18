package com.smartmatch.application.job.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Request body tạo hoặc cập nhật tin tuyển dụng")
public class JobPostingRequest {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    @Schema(description = "Tiêu đề vị trí tuyển dụng", example = "Senior Java Backend Developer")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    @Schema(description = "Mô tả chi tiết nhiệm vụ công việc")
    private String description;

    @NotBlank(message = "Yêu cầu công việc không được để trống")
    @Schema(description = "Yêu cầu kỹ năng chuyên môn và kinh nghiệm")
    private String requirements;

    @Schema(description = "Khoảng mức lương chi trả dự kiến", example = "20 - 35 triệu VNĐ")
    private String salaryRange;

    @NotBlank(message = "Địa điểm làm việc không được để trống")
    @Schema(description = "Địa điểm làm việc", example = "TP. Hồ Chí Minh")
    private String location;

    @NotNull(message = "Ngày hết hạn không được để trống")
    @Future(message = "Ngày hết hạn phải là ngày trong tương lai")
    @Schema(description = "Ngày giờ hết hạn nhận đơn ứng tuyển", example = "2025-12-31T23:59:59")
    private LocalDateTime expiredAt;
}