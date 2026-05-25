package com.smartmatch.application.auth.dto;

import com.smartmatch.domain.auth.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private Long userId;
    private Role role;
    private String email;
    private String fullName;
}