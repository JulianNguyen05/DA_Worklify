// File: \backend-core\domain\src\main\java\com\smartmatch\domain\auth\model\User.java
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
    private boolean isMfaEnabled;

    // Business Behavior: Kích hoạt MFA
    public void enableMfa() {
        if (this.isMfaEnabled) {
            throw new IllegalStateException("MFA đã được kích hoạt cho tài khoản này.");
        }
        this.isMfaEnabled = true;
    }
}