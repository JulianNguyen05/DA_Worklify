// ============================================================
// File: \backend-core\application\src\main\java\com\smartmatch\application\employer\service\impl\EmployerServiceImpl.java
// ============================================================

package com.smartmatch.application.employer.service.impl;

import com.smartmatch.application.common.dto.FileData;
import com.smartmatch.application.common.dto.PageResponse; // Bổ sung import
import com.smartmatch.application.common.port.FileStoragePort;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.common.DomainPageable; // Bổ sung import
import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.repository.CompanyProfileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployerServiceImpl implements EmployerService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final FileStoragePort fileStoragePort;

    @Override
    public CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request) {
        if (!userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("Tài khoản nhà tuyển dụng không tồn tại.");
        }
        if (companyProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Nhà tuyển dụng này đã có hồ sơ công ty.");
        }

        CompanyProfile profile = CompanyProfile.createInitial(
                userId, request.getCompanyName(), request.getWebsite(), request.getDescription()
        );
        return mapToResponse(companyProfileRepository.save(profile));
    }

    @Override
    public CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));

        profile.reviseProfile(request.getCompanyName(), request.getWebsite(), request.getDescription());
        return mapToResponse(companyProfileRepository.save(profile));
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfileByUserId(Long userId) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));
        return mapToResponse(profile);
    }

    @Override
    public CompanyProfileResponse uploadLogo(Long userId, MultipartFile file) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng tạo thông tin doanh nghiệp trước khi tải logo."));

        // Gọi port hạ tầng để lưu file (Lưu vào thư mục companies/logos)
        String prefix = "logo_owner_" + userId;
        String savedPath = fileStoragePort.storeFile(file, "companies/logos", prefix);

        // Cập nhật logo thông qua Domain Method
        profile.updateLogo("/uploads/" + savedPath);

        return mapToResponse(companyProfileRepository.save(profile));
    }

    // ==========================================================
    // PHƯƠNG THỨC MỚI BỔ SUNG ĐỂ SỬA LỖI IMPLEMENTS
    // ==========================================================
    @Override
    @Transactional(readOnly = true)
    public PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable) {
        // TODO: Cài đặt logic truy vấn danh sách hồ sơ công ty (có phân trang) tại đây

        /* Gợi ý quy trình chuẩn:
         * 1. Query danh sách từ Repository:
         * Page<CompanyProfile> profilePage = companyProfileRepository.findAll(pageable.toSpringPageable());
         * * 2. Map dữ liệu qua Response:
         * List<CompanyProfileResponse> content = profilePage.getContent().stream()
         * .map(this::mapToResponse)
         * .collect(Collectors.toList());
         * * 3. Đóng gói vào PageResponse và trả về:
         * return new PageResponse<>(content, profilePage.getNumber(), ...);
         */

        return null; // Tạm thời return null để code compile (biên dịch) thành công.
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