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
    private boolean mfaEnabled; // Cờ xác thực đa yếu tố
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Factory method để đăng ký tài khoản mới.
     */
    public static User registerNew(String email, String encryptedPassword, Role role) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Định dạng email không hợp lệ.");
        }
        return User.builder()
                .email(email)
                .password(encryptedPassword)
                .role(role)
                .status(UserStatus.ACTIVE) // Hoặc PENDING nếu cần xác thực email
                .mfaEnabled(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Nghiệp vụ: Admin khóa tài khoản vi phạm.
     */
    public void ban() {
        this.status = UserStatus.BANNED;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Nghiệp vụ: Mở khóa tài khoản.
     */
    public void unban() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Nghiệp vụ: Bật xác thực đa yếu tố để tăng cường bảo mật.
     */
    public void enableMultiFactorAuth() {
        this.mfaEnabled = true;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Nghiệp vụ: Đổi mật khẩu.
     */
    public void changePassword(String newEncryptedPassword) {
        this.password = newEncryptedPassword;
        this.updatedAt = LocalDateTime.now();
    }
}