package com.smartmatch.domain.auth.model;

import com.smartmatch.domain.common.valueobject.EmailAddress;
import com.smartmatch.domain.common.valueobject.PhoneNumber;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {
    private Long id;

    // Đã chuyển từ String sang Value Object
    private EmailAddress email;
    private PhoneNumber phone;

    private String passwordHash;
    private Role role;

    // Đã bổ sung trường status để quản lý trạng thái tài khoản
    private UserStatus status;

    private boolean isMfaEnabled;

    // Business Behavior: Kích hoạt MFA
    public void enableMfa() {
        if (this.isMfaEnabled) {
            throw new IllegalStateException("MFA đã được kích hoạt cho tài khoản này.");
        }
        this.isMfaEnabled = true;
    }

    // Business Behavior: Khóa tài khoản
    public void ban() {
        if (this.status == UserStatus.BANNED) {
            throw new IllegalStateException("Tài khoản này đã bị khóa từ trước.");
        }
        this.status = UserStatus.BANNED;
    }

    // Business Behavior: Mở khóa tài khoản
    public void unban() {
        if (this.status != UserStatus.BANNED) {
            throw new IllegalStateException("Tài khoản không nằm trong danh sách bị khóa.");
        }
        this.status = UserStatus.ACTIVE;
    }
}