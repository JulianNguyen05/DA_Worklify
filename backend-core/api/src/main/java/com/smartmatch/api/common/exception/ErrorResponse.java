package com.smartmatch.api.common.exception;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {
    private int code;
    private String message;
    private String error;

    // Lưu trữ chi tiết lỗi (Ví dụ: map các field bị lỗi validation)
    private Map<String, String> validationErrors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}