package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.Role;
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
        // 1. Kiểm tra quy tắc nghiệp vụ động theo vai trò (Dynamic Invariants Validation)
        validateRoleSpecificInvariants(request);

        // 2. Khởi tạo Value Object: Kiểm tra định dạng Email sâu ở tầng Domain
        EmailAddress emailAddress = new EmailAddress(request.getEmail());

        // 3. Kiểm tra tính duy nhất (Domain Boundary Rule)
        if (userRepository.existsByEmail(emailAddress.value())) {
            throw new IllegalArgumentException("Địa chỉ email này đã tồn tại trên hệ thống.");
        }

        // 4. Mã hóa mật khẩu bảo mật
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 5. Khởi tạo Rich Domain Model thông qua Builder/Factory
        // Lưu ý: Nếu thực thể User của bạn chứa thông tin tên, hãy map vào.
        // Nếu Candidate/Employer là 2 Aggregate độc lập, tầng này sẽ gọi thêm CandidateRepository/CompanyRepository để lưu trữ hồ sơ.
        User newUser = User.builder()
                .email(emailAddress)
                .passwordHash(hashedPassword)
                .role(request.getRole())
                .isMfaEnabled(false)
                // Giả định thực thể User thiết kế theo dạng hội tụ thông tin cơ bản:
                // .fullName(request.getRole() == Role.CANDIDATE ? request.getFullName() : null)
                // .companyName(request.getRole() == Role.EMPLOYER ? request.getCompanyName() : null)
                .build();

        // 6. Lưu trữ thông qua Port (Repository Interface)
        User savedUser = userRepository.save(newUser);

        // 7. Ánh xạ dữ liệu trả về cho Application DTO
        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail().value())
                .role(savedUser.getRole())
                .mfaEnabled(savedUser.isMfaEnabled())
                .build();
    }

    /**
     * Hàm kiểm tra luật nghiệp vụ Fail-Fast theo nguyên tắc DDD
     */
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

        return AuthResponse.builder()
                .userId(user.getId())
                .role(user.getRole())
                .expiresIn(3600)
                .build();
    }

    @Override
    @Transactional
    public void enableMfa(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại trên hệ thống."));

        user.enableMfa(); // Đóng gói logic nghiệp vụ bên trong thực thể Domain (Rich Domain Model)
        userRepository.save(user);
    }
}