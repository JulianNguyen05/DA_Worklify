// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\persistence\entity\UserJpaEntity.java
package com.smartmatch.infrastructure.persistence.entity;

import com.worklify.domain.auth.model.Role;
import com.worklify.domain.auth.model.UserStatus;
import jakarta.persistence.*;
import lombok.*;
// [ĐÃ THÊM] Import thư viện tự động tạo thời gian của Hibernate
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "mfa_enabled", nullable = false)
    private boolean mfaEnabled;

    // [ĐÃ THÊM] Tự động lấy thời gian hiện tại khi Insert lần đầu
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // [ĐÃ THÊM] Tự động lấy thời gian hiện tại mỗi khi record bị Update
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}