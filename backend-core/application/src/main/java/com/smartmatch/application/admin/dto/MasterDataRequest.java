package com.smartmatch.application.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class MasterDataRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
}
