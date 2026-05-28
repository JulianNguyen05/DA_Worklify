package com.worklify.application.candidate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CandidateProfileRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private String summary;
    // Chuỗi kỹ năng phân tách bằng dấu phẩy (vd: "Java, React, Docker")
    private String skills;
}