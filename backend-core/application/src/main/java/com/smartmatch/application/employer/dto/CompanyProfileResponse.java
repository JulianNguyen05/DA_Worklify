package com.smartmatch.application.employer.dto;

import com.smartmatch.domain.employer.model.VerificationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hồ sơ doanh nghiệp")
public class CompanyProfileResponse {

    @Schema(description = "ID hồ sơ doanh nghiệp", example = "1")
    private Long id;

    @Schema(description = "ID tài khoản nhà tuyển dụng liên kết", example = "10")
    private Long userId;

    @Schema(description = "Tên chính thức của doanh nghiệp", example = "Công ty TNHH SmartTech")
    private String companyName;

    @Schema(description = "URL ảnh logo công ty", example = "https://cdn.smartmatch.vn/logos/smarttech.png")
    private String logoUrl;

    @Schema(description = "Website chính thức", example = "https://smarttech.vn")
    private String website;

    @Schema(description = "Mô tả tổng quan văn hóa, môi trường làm việc")
    private String description;

    @Schema(description = "Trạng thái xác minh pháp lý", example = "PENDING")
    private VerificationStatus verificationStatus;
}