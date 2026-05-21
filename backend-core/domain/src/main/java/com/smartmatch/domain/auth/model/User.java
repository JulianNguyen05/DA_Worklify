package com.smartmatch.domain.auth.model;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {
    private Long id;
    private String email;
    private String password;
    private Role role;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    private boolean mfaEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Phương thức khởi tạo chuẩn cho Domain.
     * Validation được thực hiện trực tiếp tại đây để bảo vệ bất biến của thực thể.
     */
    public static User createNewUser(String email, String hashedPassword, Role role) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (email == null || !email.matches(emailRegex)) {
            throw new IllegalArgumentException("Định dạng email không hợp lệ.");
        }

        User user = User.builder()
                .email(email.toLowerCase().trim())
                .password(hashedPassword)
                .role(role)
                .status(UserStatus.ACTIVE)
                .mfaEnabled(false)
                .build();

        user.onCreate();
        return user;
    }

    // Khởi tạo thời gian ban đầu
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Phương thức cập nhật thời gian mỗi khi thay đổi trạng thái
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void ban() {
        this.status = UserStatus.BANNED;
        this.onUpdate();
    }

    public void unban() {
        this.status = UserStatus.ACTIVE;
        this.onUpdate();
    }

    public void enableMultiFactorAuth() {
        this.mfaEnabled = true;
        this.onUpdate();
    }

    public void changePassword(String newEncryptedPassword) {
        this.password = newEncryptedPassword;
        this.onUpdate();
    }
}