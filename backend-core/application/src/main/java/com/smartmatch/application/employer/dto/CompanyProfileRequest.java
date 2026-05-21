package com.smartmatch.application.employer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyProfileRequest {
    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;
    private String website;
    private String description;
}