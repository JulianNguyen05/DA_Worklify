package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.Role;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.model.UserStatus; // [ĐÃ THÊM] Import UserStatus
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.valueobject.EmailAddress;
import com.smartmatch.application.common.port.TokenProviderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smartmatch.application.auth.dto.ChangePasswordRequest;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProviderPort tokenProviderPort;

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
                .status(UserStatus.ACTIVE) // [ĐÃ THÊM] Gán trạng thái để không bị lỗi null status
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

        String token = tokenProviderPort.generateToken(user.getEmail().value(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .accessToken(token)
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

    @Override
    @Transactional
    public void forgotPassword(String email) {
        EmailAddress emailAddress = new EmailAddress(email);

        // 1. Kiểm tra xem user có tồn tại không
        User user = userRepository.findByEmail(emailAddress.value())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với email này."));

        // 2. TẠO LOGIC GỬI EMAIL (Mô phỏng)
        // Trong thực tế, bạn sẽ cần tạo một PasswordResetToken, lưu vào DB và dùng JavaMailSender để gửi link/OTP.
        // Ở bước này, chúng ta mô phỏng việc sinh mã token tạm thời.
        String resetToken = java.util.UUID.randomUUID().toString();

        // In ra console để debug (Thay thế bằng code gửi Email thật sau này)
        System.out.println("========== YÊU CẦU KHÔI PHỤC MẬT KHẨU ==========");
        System.out.println("Email nhận: " + user.getEmail().value());
        System.out.println("Token khôi phục: " + resetToken);
        System.out.println("================================================");
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        // 1. Tìm người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại trên hệ thống."));

        // 2. Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác.");
        }

        // 3. Mã hóa mật khẩu mới
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());

        // 4. Cập nhật mật khẩu (Lưu ý: Đảm bảo class User ở tầng Domain có phương thức updatePassword)
        user.updatePassword(newHashedPassword);

        // 5. Lưu xuống DB
        userRepository.save(user);
    }
}