package com.worklify.application.matching.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Ứng viên chấp nhận một gợi ý của agent: ghi nội dung mới vào mục tương ứng trong hồ sơ online.
 */
@Data
public class ApplyCvSuggestionRequest {

    @NotBlank(message = "Thiếu loại mục hồ sơ")
    private String sectionType;

    /** Bắt buộc với experience/project; bỏ trống với summary. */
    private Long sectionId;

    @NotBlank(message = "Nội dung không được để trống")
    @Size(max = 5000, message = "Nội dung tối đa 5000 ký tự")
    private String text;
}
