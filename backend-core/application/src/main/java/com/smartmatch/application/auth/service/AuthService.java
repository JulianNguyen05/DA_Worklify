package com.smartmatch.application.auth.service;

import com.smartmatch.application.auth.dto.AuthResponse;
import com.smartmatch.application.auth.dto.LoginRequest;
import com.smartmatch.application.auth.dto.RegisterRequest;
import com.smartmatch.application.auth.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port (Use-case interface) cho Bounded Context Auth.
 * Tầng Infrastructure sẽ cài đặt (implement) interface này.
 */
public interface AuthService {

    /**
     * Đăng ký tài khoản mới (CANDIDATE hoặc EMPLOYER).
     *
     * @param request thông tin đăng ký
     * @return thông tin tài khoản vừa tạo
     */
    UserResponse register(RegisterRequest request);

    /**
     * Đăng nhập và trả về JWT token.
     *
     * @param request thông tin đăng nhập
     * @return JWT token và thông tin người dùng
     */
    AuthResponse login(LoginRequest request);

    /**
     * Lấy thông tin người dùng theo ID.
     *
     * @param userId ID người dùng
     * @return thông tin tài khoản
     */
    UserResponse getUserById(Long userId);

    /**
     * Lấy danh sách tất cả người dùng (dành cho Admin).
     *
     * @param pageable thông tin phân trang
     * @return danh sách tài khoản có phân trang
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Khóa tài khoản vi phạm (dành cho Admin - RBAC).
     *
     * @param userId ID tài khoản cần khóa
     */
    void banUser(Long userId);

    /**
     * Mở khóa tài khoản (dành cho Admin - RBAC).
     *
     * @param userId ID tài khoản cần mở khóa
     */
    void unbanUser(Long userId);

    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
}