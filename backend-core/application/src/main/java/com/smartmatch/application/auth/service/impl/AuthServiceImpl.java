package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.Role;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.valueobject.EmailAddress;
import com.smartmatch.application.common.port.TokenProviderPort; // Đã thêm import JwtService
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProviderPort tokenProviderPort; // [SỬA]: Tiêm JwtService vào để tạo token

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        validateRoleSpecificInvariants(request);

        EmailAddress emailAddress = new EmailAddress(request.getEmail());

        if (userRepository.existsByEmail(emailAddress.value())) {
            throw new IllegalArgumentException("Địa chỉ email này đã tồn tại trên hệ thống.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = User.builder()
                .email(emailAddress)
                .passwordHash(hashedPassword)
                .role(request.getRole())
                .isMfaEnabled(false)
                .build();

        User savedUser = userRepository.save(newUser);

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail().value())
                .role(savedUser.getRole())
                .mfaEnabled(savedUser.isMfaEnabled())
                .build();
    }

    private void validateRoleSpecificInvariants(RegisterRequest request) {
        if (request.getRole() == Role.CANDIDATE) {
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                throw new IllegalArgumentException("Họ và tên không được để trống đối với vai trò Ứng viên.");
            }
        } else if (request.getRole() == Role.EMPLOYER) {
            if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
                throw new IllegalArgumentException("Tên doanh nghiệp không được để trống đối với Nhà tuyển dụng.");
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        EmailAddress emailAddress = new EmailAddress(request.getEmail());

        User user = userRepository.findByEmail(emailAddress.value())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác.");
        }

        // [SỬA QUAN TRỌNG]: TẠO TOKEN THỰC TẾ
        String token = tokenProviderPort.generateToken(user.getEmail().value(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .accessToken(token) // Đã đính kèm token vào response
                .userId(user.getId())
                .role(user.getRole())
                .expiresIn(3600L)
                .build();
    }

    @Override
    @Transactional
    public void enableMfa(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại trên hệ thống."));

        user.enableMfa();
        userRepository.save(user);
    }
}