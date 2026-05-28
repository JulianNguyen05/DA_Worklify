package com.worklify.api.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @Builder.Default
    private int code = 200;

    @Builder.Default
    private String message = "Thành công";

    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    // Helper method trả về dữ liệu thành công
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message("Thành công")
                .data(data)
                .build();
    }

    // Helper method trả về dữ liệu thành công kèm custom message
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .build();
    }

    // [ĐÃ SỬA] Định nghĩa chi tiết cho hàm xử lý lỗi Validation đầu vào (DTO)
    public static ApiResponse<Map<String, String>> error(Map<String, String> errors, String topLevelMessage) {
        return ApiResponse.<Map<String, String>>builder()
                .code(400) // HTTP Status 400 Bad Request
                .message(topLevelMessage)
                .data(errors) // Trả về map chi tiết: {"email": "Định dạng không hợp lệ", ...}
                .build();
    }

    // [BỔ SUNG] Helper method xử lý các lỗi chuỗi thông thường (Lỗi nghiệp vụ, Hệ thống)
    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .data(null)
                .build();
    }
}