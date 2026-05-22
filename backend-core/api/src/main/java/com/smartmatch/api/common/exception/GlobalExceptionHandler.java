package com.smartmatch.api.common.exception; // Giữ nguyên package cũ của bạn

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 1. Bắt lỗi vi phạm quy tắc nghiệp vụ (Ví dụ: Trùng Email khi đăng ký)
     * Thường ném ra từ tầng Service bằng: throw new IllegalArgumentException("Email đã tồn tại");
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * 2. Bắt lỗi ràng buộc dữ liệu đầu vào DTO (@NotBlank, @Email, @Size,...)
     * Trích xuất thông báo thân thiện đầu tiên cho React hiển thị trực quan
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errorResponse = new HashMap<>();

        FieldError fieldError = ex.getBindingResult().getFieldError();
        String cleanMessage = (fieldError != null) ? fieldError.getDefaultMessage() : "Dữ liệu gửi lên không đúng định dạng.";

        errorResponse.put("message", cleanMessage);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * 3. Bắt các lỗi hệ thống phát sinh ngoài ý muốn (NullPointer, lỗi DB,...)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Hệ thống SmartMatch gặp sự cố bất ngờ: " + ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}