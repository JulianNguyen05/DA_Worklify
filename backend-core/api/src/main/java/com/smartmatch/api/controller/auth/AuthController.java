package com.smartmatch.api.controller.auth;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // THÊM IMPORT NÀY

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "1. Authentication", description = "Các API Đăng nhập, Đăng ký và Quản lý bảo mật")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới (Ứng viên / Nhà tuyển dụng)")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ApiResponse.success(response, "Đăng ký tài khoản thành công");
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống cấp JWT Token")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success(response, "Đăng nhập thành công");
    }

    @PostMapping("/{userId}/mfa/enable")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Kích hoạt xác thực đa yếu tố (MFA)")
    public ApiResponse<Void> enableMfa(@PathVariable Long userId) {
        authService.enableMfa(userId);
        return ApiResponse.success(null, "Kích hoạt MFA thành công");
    }

    // ========== BỔ SUNG API QUÊN MẬT KHẨU ==========
    @PostMapping("/forgot-password")
    @Operation(summary = "Yêu cầu khôi phục mật khẩu")
    public ApiResponse<Void> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống.");
        }

        // Gọi xuống tầng Service để xử lý
        authService.forgotPassword(email);

        return ApiResponse.success(null, "Yêu cầu khôi phục mật khẩu đã được xử lý");
    }
    @PutMapping("/{userId}/password")
    @PreAuthorize("isAuthenticated()") // Yêu cầu phải có token JWT
    @Operation(summary = "Đổi mật khẩu người dùng")
    public ApiResponse<Void> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(userId, request);
        return ApiResponse.success(null, "Đổi mật khẩu thành công");
    }
}