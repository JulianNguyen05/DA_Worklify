package com.worklify.application.auth.service.impl;

import com.worklify.application.auth.dto.*;
import com.worklify.application.auth.service.AuthService;
import com.worklify.domain.auth.model.Role;
import com.worklify.domain.auth.model.User;
import com.worklify.domain.auth.model.UserStatus;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.valueobject.EmailAddress;
import com.worklify.application.common.port.TokenProviderPort;

// [ĐÃ THÊM] Import các Repository và Model của Candidate và Employer
import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.repository.CompanyProfileRepository;

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

        // Tự động khởi tạo Profile sau khi đăng ký thành công
        if (savedUser.getRole() == Role.CANDIDATE && request.getFullName() != null) {
            CandidateProfile profile = CandidateProfile.create(savedUser.getId(), request.getFullName());
            candidateProfileRepository.save(profile);
        } else if (savedUser.getRole() == Role.EMPLOYER && request.getCompanyName() != null) {
            CompanyProfile profile = CompanyProfile.createInitial(
                    savedUser.getId(), request.getCompanyName(), null, null
            );
            companyProfileRepository.save(profile);
        }

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail().value())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
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

        // Trích xuất tên hiển thị dựa trên role
        String displayName = user.getEmail().value().split("@")[0];

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

        String token = tokenProviderPort.generateToken(
                user.getEmail().value(), user.getRole().name(), user.getId()
        );

        return AuthResponse.builder()
                .accessToken(token)
                .userId(user.getId())
                .role(user.getRole())
                .email(user.getEmail().value())
                .fullName(displayName)
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

        userRepository.findByEmail(emailAddress.value())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với email này."));

        String resetToken = java.util.UUID.randomUUID().toString();
        // TODO: Gửi email chứa resetToken cho người dùng
        System.out.println("[FORGOT PASSWORD] Token: " + resetToken + " | Email: " + email);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại trên hệ thống."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác.");
        }

        user.updatePassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}