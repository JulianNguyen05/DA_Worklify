// ============================================================
// File: \backend-core\application\src\main\java\com\smartmatch\application\employer\service\impl\EmployerServiceImpl.java
// ============================================================

package com.smartmatch.application.employer.service.impl;

import com.smartmatch.application.common.dto.FileData;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.repository.CompanyProfileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployerServiceImpl implements EmployerService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;

    @Override
    public CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request) {
        // 1. Kiểm tra User có tồn tại không
        if (!userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("Tài khoản nhà tuyển dụng không tồn tại.");
        }

        // 2. Kiểm tra nhà tuyển dụng đã tạo profile chưa
        if (companyProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Nhà tuyển dụng này đã có hồ sơ công ty.");
        }

        // 3. Khởi tạo Domain Entity CompanyProfile qua Factory method
        CompanyProfile profile = CompanyProfile.createInitial(
                userId,
                request.getCompanyName(),
                request.getWebsite(),
                request.getDescription()
        );

        // 4. Lưu vào Database
        CompanyProfile savedProfile = companyProfileRepository.save(profile);

        log.info("Hồ sơ doanh nghiệp {} được tạo thành công bởi user id: {}", savedProfile.getCompanyName(), userId);

        // 5. Trả về DTO
        return mapToResponse(savedProfile);
    }

    @Override
    public CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));

        // Thực hiện cập nhật thông qua phương thức nghiệp vụ của Entity
        // Nếu tên công ty hoặc website thay đổi, verificationStatus sẽ tự động về PENDING theo Domain Rule
        profile.reviseProfile(
                request.getCompanyName(),
                request.getWebsite(),
                request.getDescription()
        );

        CompanyProfile updatedProfile = companyProfileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfileByUserId(Long userId) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));

        return mapToResponse(profile);
    }

    @Override
    public CompanyProfileResponse uploadLogo(Long userId, FileData logoData) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));

        // TODO: Gọi port hạ tầng lưu file (S3, Local...) để upload logoData
        // Giả lập đường dẫn file sau khi upload thành công
        String uploadedLogoUrl = "/uploads/logos/" + System.currentTimeMillis() + "_" + logoData.fileName();

        // Cập nhật logo thông qua Domain Method
        profile.updateLogo(uploadedLogoUrl);

        CompanyProfile updatedProfile = companyProfileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    // ==========================================================
    // PRIVATE HELPER METHODS (MAPPING)
    // ==========================================================

    private CompanyProfileResponse mapToResponse(CompanyProfile profile) {
        return CompanyProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .logoUrl(profile.getLogoUrl())
                .website(profile.getWebsite())
                .description(profile.getDescription())
                .verificationStatus(profile.getVerificationStatus())
                .build();
    }
}