package com.worklify.application.auth.service;
import com.worklify.application.auth.dto.*;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void enableMfa(Long userId);
    void forgotPassword(String email);
    void changePassword(Long userId, ChangePasswordRequest request);
}