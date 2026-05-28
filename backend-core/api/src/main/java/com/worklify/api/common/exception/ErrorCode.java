package com.worklify.api.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(200, "Thành công"),
    BAD_REQUEST(400, "Dữ liệu đầu vào không hợp lệ"),
    UNAUTHORIZED(401, "Chưa xác thực hoặc token hết hạn"),
    FORBIDDEN(403, "Không có quyền truy cập tài nguyên này"),
    NOT_FOUND(404, "Không tìm thấy tài nguyên"),
    INTERNAL_SERVER_ERROR(500, "Lỗi hệ thống máy chủ");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}