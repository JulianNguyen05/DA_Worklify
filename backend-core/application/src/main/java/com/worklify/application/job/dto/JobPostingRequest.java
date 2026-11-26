package com.worklify.application.job.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobPostingRequest {
    @NotBlank(message = "Tiêu đề công việc không được để trống")
    @Size(max = 255, message = "Tiêu đề công việc tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    @NotBlank(message = "Yêu cầu công việc không được để trống")
    private String requirements;

    // Chuỗi hiển thị tự do, vd "15 - 25 triệu", "Thoả thuận"
    @Size(max = 100, message = "Mức lương hiển thị tối đa 100 ký tự")
    private String salaryRange;

    // Khoảng lương dạng số (triệu VNĐ/tháng) để ứng viên lọc; bỏ trống = thoả thuận
    @Min(value = 0, message = "Mức lương không được âm")
    @Max(value = 1000, message = "Mức lương tính theo triệu VNĐ, tối đa 1000")
    private Integer salaryMin;

    @Min(value = 0, message = "Mức lương không được âm")
    @Max(value = 1000, message = "Mức lương tính theo triệu VNĐ, tối đa 1000")
    private Integer salaryMax;

    @NotBlank(message = "Địa điểm làm việc không được để trống")
    @Size(max = 255, message = "Địa điểm tối đa 255 ký tự")
    private String location;

    private String workType;

    @NotNull(message = "Hạn nộp hồ sơ không được để trống")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;
}
