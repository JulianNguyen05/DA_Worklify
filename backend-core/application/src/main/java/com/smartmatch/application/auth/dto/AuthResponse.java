package com.smartmatch.application.auth.dto;

import com.smartmatch.domain.auth.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response trả về sau khi đăng nhập thành công")
public class AuthResponse {

    @Schema(description = "JWT Access Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "Loại token", example = "Bearer")
    private String tokenType = "Bearer";

    @Schema(description = "ID người dùng", example = "1")
    private Long userId;

    @Schema(description = "Email người dùng", example = "user@example.com")
    private String email;

    @Schema(description = "Vai trò người dùng", example = "CANDIDATE")
    private Role role;
}