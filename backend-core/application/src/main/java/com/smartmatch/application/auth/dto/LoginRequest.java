package com.smartmatch.application.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request body cho chức năng đăng nhập")
public class LoginRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Schema(description = "Địa chỉ email đăng nhập", example = "user@example.com")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Schema(description = "Mật khẩu tài khoản", example = "securePass123")
    private String password;
}