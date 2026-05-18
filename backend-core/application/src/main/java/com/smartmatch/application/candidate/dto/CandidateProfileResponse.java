package com.smartmatch.application.candidate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hồ sơ ứng viên")
public class CandidateProfileResponse {

    @Schema(description = "ID hồ sơ ứng viên", example = "1")
    private Long id;

    @Schema(description = "ID tài khoản liên kết", example = "5")
    private Long userId;

    @Schema(description = "Họ và tên đầy đủ", example = "Nguyễn Văn An")
    private String fullName;

    @Schema(description = "Số điện thoại liên hệ", example = "0901234567")
    private String phone;

    @Schema(description = "Giới tính", example = "Nam")
    private String gender;

    @Schema(description = "Ngày sinh", example = "2000-05-15")
    private LocalDate dob;

    @Schema(description = "Địa chỉ cư trú", example = "TP.HCM")
    private String address;

    @Schema(description = "Danh sách kỹ năng của ứng viên")
    private List<SkillResponse> skills;
}