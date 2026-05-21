package com.smartmatch.application.auth.service;
import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getUserById(Long userId);
    PageResponse<UserResponse> getAllUsers(DomainPageable pageable);
    void banUser(Long userId);
    void unbanUser(Long userId);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    void enableMfa(Long userId);
}