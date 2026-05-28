package com.smartmatch.application.auth.dto;

import com.worklify.domain.auth.model.Role;
import com.worklify.domain.auth.model.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private Role role;
    private UserStatus status;
    private boolean mfaEnabled;
    private LocalDateTime createdAt;
}