package com.smartmatch.api.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Bắt lỗi Validation từ các Request DTO (VD: @NotBlank, @Email)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation error: {}", errors);

        return ErrorResponse.builder()
                .code(ErrorCode.BAD_REQUEST.getCode())
                .message(ErrorCode.BAD_REQUEST.getMessage())
                .error("Validation Failed")
                .validationErrors(errors)
                .build();
    }

    /**
     * Bắt lỗi Logic nghiệp vụ (Do chúng ta ném IllegalArgumentException ở tầng Domain/Application)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Business Logic error (IllegalArgument): {}", ex.getMessage());
        return ErrorResponse.builder()
                .code(ErrorCode.BAD_REQUEST.getCode())
                .message(ex.getMessage()) // Trả về câu thông báo được định nghĩa ở tầng Core
                .error("Bad Request")
                .build();
    }

    /**
     * Bắt lỗi Trạng thái nghiệp vụ không hợp lệ (Do ném IllegalStateException)
     */
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT) // 409 Conflict thường hợp lý cho sai luồng trạng thái
    public ErrorResponse handleIllegalStateException(IllegalStateException ex) {
        log.warn("Business Logic error (IllegalState): {}", ex.getMessage());
        return ErrorResponse.builder()
                .code(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .error("Conflict State")
                .build();
    }

    /**
     * Bắt các lỗi chưa được định nghĩa (Fall-back)
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGlobalException(Exception ex) {
        log.error("Internal Server Error: ", ex);
        return ErrorResponse.builder()
                .code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .message(ErrorCode.INTERNAL_SERVER_ERROR.getMessage())
                .error(ex.getMessage())
                .build();
    }
}