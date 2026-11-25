package com.worklify.application.common.exception;

/**
 * Dịch vụ AI (backend-ml) không phản hồi hoặc trả lỗi — trả về HTTP 503 cho frontend.
 */
public class AiServiceException extends RuntimeException {
    public AiServiceException(String message) { super(message); }
    public AiServiceException(String message, Throwable cause) { super(message, cause); }
}
