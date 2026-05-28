package com.worklify.application.common.port;

public interface TokenProviderPort {
    /** Tạo chuỗi token mã hóa chứa thông tin định danh */
    String generateToken(String email, String role, Long userId);
}