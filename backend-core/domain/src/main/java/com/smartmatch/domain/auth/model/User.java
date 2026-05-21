package com.smartmatch.domain.auth.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {
    private Long id;
    private String email;
    private String password;
    private Role role;
    private UserStatus status;
    private boolean mfaEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static User registerNew(String email, String encryptedPassword, Role role) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Định dạng email không hợp lệ.");
        }
        return User.builder()
                .email(email)
                .password(encryptedPassword)
                .role(role)
                .status(UserStatus.ACTIVE)
                .mfaEnabled(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void ban() {
        this.status = UserStatus.BANNED;
        this.updatedAt = LocalDateTime.now();
    }

    public void unban() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    public void enableMultiFactorAuth() {
        this.mfaEnabled = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void changePassword(String newEncryptedPassword) {
        this.password = newEncryptedPassword;
        this.updatedAt = LocalDateTime.now();
    }
}