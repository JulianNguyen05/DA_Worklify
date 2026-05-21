package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. Kiểm tra nghiệp vụ: Email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống.");
        }

        // 2. Xử lý hạ tầng: Mã hóa mật khẩu (hashing)
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Gọi Domain khởi tạo User (Rich Domain Model)
        User newUser = User.createNewUser(request.getEmail(), hashedPassword, request.getRole());

        // 4. Persist qua Port
        User savedUser = userRepository.save(newUser);

        // 5. Chuyển đổi sang Response DTO
        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .mfaEnabled(savedUser.isMfaEnabled())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác"));

        // 2. Kiểm tra mật khẩu (hashing)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác");
        }

        // 3. Trả về thông tin đăng nhập
        return AuthResponse.builder()
                .userId(user.getId())
                .role(user.getRole())
                .expiresIn(3600) // Thời gian mặc định 1 giờ
                .build();
    }

    @Override
    @Transactional
    public void enableMfa(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        // Gọi logic thay đổi trạng thái trong Domain
        user.enableMultiFactorAuth();

        // Cập nhật timestamp cho User
        user.onUpdate();

        userRepository.save(user);
    }
}