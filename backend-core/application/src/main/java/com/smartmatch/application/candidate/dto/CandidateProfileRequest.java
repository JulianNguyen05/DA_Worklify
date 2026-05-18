package com.smartmatch.application.candidate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(description = "Request body tạo hoặc cập nhật hồ sơ ứng viên")
public class CandidateProfileRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Schema(description = "Họ và tên đầy đủ", example = "Nguyễn Văn An")
    private String fullName;

    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    @Schema(description = "Số điện thoại liên hệ", example = "0901234567")
    private String phone;

    @Schema(description = "Giới tính", example = "Nam", allowableValues = {"Nam", "Nữ", "Khác"})
    private String gender;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @Schema(description = "Ngày sinh (yyyy-MM-dd)", example = "2000-05-15")
    private LocalDate dob;

    @Schema(description = "Địa chỉ cư trú hiện tại", example = "123 Nguyễn Huệ, Q1, TP.HCM")
    private String address;
}