package com.smartmatch.application.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MasterDataRequest {
    @jakarta.validation.constraints.NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    private String description;
}
