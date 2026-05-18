package com.smartmatch.application.auth.dto;

import com.smartmatch.domain.auth.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body cho chức năng đăng ký tài khoản")
public class RegisterRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Schema(description = "Địa chỉ email đăng ký", example = "user@example.com")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Schema(description = "Mật khẩu (tối thiểu 8 ký tự)", example = "securePass123")
    private String password;

    @NotNull(message = "Vai trò không được để trống")
    @Schema(description = "Vai trò người dùng: CANDIDATE hoặc EMPLOYER", example = "CANDIDATE")
    private Role role;
}