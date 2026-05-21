package com.smartmatch.application.auth.service;
import com.smartmatch.application.auth.dto.*;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void banUser(Long userId);
    void unbanUser(Long userId);
    void enableMfa(Long userId);
}