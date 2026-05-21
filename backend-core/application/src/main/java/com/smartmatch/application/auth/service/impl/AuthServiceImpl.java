package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.valueobject.EmailAddress;
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
        // 1. Khởi tạo Value Object: Nếu email sai định dạng, Exception sẽ bị ném ra ngay tại đây (Fail-fast)
        EmailAddress emailAddress = new EmailAddress(request.getEmail());

        // 2. Kiểm tra nghiệp vụ: Email đã tồn tại
        if (userRepository.existsByEmail(emailAddress.value())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống.");
        }

        // 3. Xử lý hạ tầng: Mã hóa mật khẩu (hashing)
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 4. Gọi Domain khởi tạo User (Rich Domain Model sử dụng Builder hoặc Factory method)
        User newUser = User.builder()
                .email(emailAddress)
                .passwordHash(hashedPassword)
                .role(request.getRole())
                .isMfaEnabled(false) // Trạng thái mặc định
                .build();

        // 5. Persist qua Port (Repository Interface)
        User savedUser = userRepository.save(newUser);

        // 6. Chuyển đổi sang Response DTO (Lấy raw string từ Value Object)
        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail().value()) // Trích xuất String từ EmailAddress
                .role(savedUser.getRole())
                // .status(savedUser.getStatus()) // Tuỳ thuộc vào việc bạn có định nghĩa status không
                .mfaEnabled(savedUser.isMfaEnabled())
                // .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 1. Khởi tạo Value Object để tận dụng logic validation
        EmailAddress emailAddress = new EmailAddress(request.getEmail());

        // 2. Tìm user theo email
        User user = userRepository.findByEmail(emailAddress.value())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác"));

        // 3. Kiểm tra mật khẩu (hashing) - Gọi đúng field passwordHash
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác");
        }

        // 4. Trả về thông tin đăng nhập
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

        // Gọi logic thay đổi trạng thái đóng gói trong Domain thay vì thao tác trực tiếp bằng setter
        user.enableMfa();

        // Lưu lại trạng thái
        userRepository.save(user);
    }
}