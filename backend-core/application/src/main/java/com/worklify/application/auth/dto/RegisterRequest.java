package com.worklify.application.auth.dto;

import com.worklify.domain.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Địa chỉ Email không được để trống")
    @Email(message = "Định dạng Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự")
    private String password;

    @NotNull(message = "Vai trò người dùng bắt buộc phải chọn")
    private Role role;

    // Bắt buộc nếu role = CANDIDATE
    private String fullName;

    // Bắt buộc nếu role = EMPLOYER
    private String companyName;
}