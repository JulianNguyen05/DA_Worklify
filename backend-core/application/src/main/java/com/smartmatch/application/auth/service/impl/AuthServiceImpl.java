package com.smartmatch.application.auth.service.impl;

import com.smartmatch.application.auth.dto.*;
import com.smartmatch.application.auth.service.AuthService;
import com.smartmatch.domain.auth.model.Role;
import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.auth.model.UserStatus;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.valueobject.EmailAddress;
import com.smartmatch.application.common.port.TokenProviderPort;

// [ĐÃ THÊM] Import các Repository và Model của Candidate và Employer
import com.smartmatch.domain.candidate.model.CandidateProfile;
import com.smartmatch.domain.candidate.repository.CandidateProfileRepository;
import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.repository.CompanyProfileRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProviderPort tokenProviderPort;

    // [ĐÃ THÊM] Inject Repository để truy xuất thông tin Tên
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;

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
                .status(UserStatus.ACTIVE)
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

        // [ĐÃ THÊM] LOGIC TRÍCH XUẤT TÊN HIỂN THỊ DỰA TRÊN ROLE
        String displayName = user.getEmail().value().split("@")[0]; // Mặc định nếu không tìm thấy profile

        if (user.getRole() == Role.CANDIDATE) {
            Optional<CandidateProfile> candidateOpt = candidateProfileRepository.findByUserId(user.getId());
            if (candidateOpt.isPresent() && candidateOpt.get().getFullName() != null) {
                displayName = candidateOpt.get().getFullName();
            }
        } else if (user.getRole() == Role.EMPLOYER) {
            Optional<CompanyProfile> companyOpt = companyProfileRepository.findByUserId(user.getId());
            if (companyOpt.isPresent() && companyOpt.get().getCompanyName() != null) {
                displayName = companyOpt.get().getCompanyName();
            }
        } else if (user.getRole() == Role.ADMIN) {
            displayName = "Ban Quản Trị";
        }

        String token = tokenProviderPort.generateToken(user.getEmail().value(), user.getRole().name(), user.getId());

        // [ĐÃ CẬP NHẬT] Thêm thuộc tính email và fullName vào Builder
        return AuthResponse.builder()
                .accessToken(token)
                .userId(user.getId())
                .role(user.getRole())
                .email(user.getEmail().value()) // Gửi email về FE
                .fullName(displayName)          // Gửi tên hiển thị về FE
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

        User user = userRepository.findByEmail(emailAddress.value())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với email này."));

        String resetToken = java.util.UUID.randomUUID().toString();

        System.out.println("========== YÊU CẦU KHÔI PHỤC MẬT KHẨU ==========");
        System.out.println("Email nhận: " + user.getEmail().value());
        System.out.println("Token khôi phục: " + resetToken);
        System.out.println("================================================");
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại trên hệ thống."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác.");
        }

        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(newHashedPassword);

        userRepository.save(user);
    }
}