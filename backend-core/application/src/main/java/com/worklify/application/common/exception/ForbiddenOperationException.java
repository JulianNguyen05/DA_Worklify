package com.worklify.application.common.exception;

/**
 * Người dùng đã đăng nhập nhưng không có quyền trên tài nguyên này
 * (vd nhà tuyển dụng xem ứng viên của tin tuyển dụng thuộc công ty khác) — trả về HTTP 403.
 */
public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message) { super(message); }
}
