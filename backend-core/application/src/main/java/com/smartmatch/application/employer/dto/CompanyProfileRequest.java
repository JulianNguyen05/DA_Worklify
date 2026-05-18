package com.smartmatch.application.employer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Schema(description = "Request body tạo hoặc cập nhật hồ sơ doanh nghiệp")
public class CompanyProfileRequest {

    @NotBlank(message = "Tên công ty không được để trống")
    @Schema(description = "Tên chính thức của doanh nghiệp", example = "Công ty TNHH SmartTech")
    private String companyName;

    @Schema(description = "Mô tả tổng quan văn hóa, môi trường làm việc")
    private String description;

    @Pattern(regexp = "^(https?://)?([\\w.-]+)\\.([a-z]{2,6})(:[0-9]{1,5})?(/.*)?$",
            message = "Website không đúng định dạng URL")
    @Schema(description = "Website chính thức", example = "https://smarttech.vn")
    private String website;
}