package com.smartmatch.application.auth.dto;

import com.smartmatch.domain.auth.model.Role;
import com.smartmatch.domain.auth.model.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin tài khoản người dùng")
public class UserResponse {

    @Schema(description = "ID người dùng", example = "1")
    private Long id;

    @Schema(description = "Email người dùng", example = "user@example.com")
    private String email;

    @Schema(description = "Vai trò người dùng", example = "CANDIDATE")
    private Role role;

    @Schema(description = "Trạng thái tài khoản", example = "ACTIVE")
    private UserStatus status;

    @Schema(description = "Thời điểm tạo tài khoản")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm cập nhật gần nhất")
    private LocalDateTime updatedAt;
}