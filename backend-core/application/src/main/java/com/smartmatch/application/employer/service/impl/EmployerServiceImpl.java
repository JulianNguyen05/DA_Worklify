// ============================================================
// File: \backend-core\application\src\main\java\com\smartmatch\application\employer\service\impl\EmployerServiceImpl.java
// ============================================================

package com.smartmatch.application.employer.service.impl;

import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.common.port.FileStoragePort;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.repository.CompanyLikeRepository;
import com.worklify.domain.employer.repository.CompanyProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployerServiceImpl implements EmployerService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final FileStoragePort fileStoragePort;
    private final CompanyLikeRepository companyLikeRepository;

    @Override
    public CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request) {
        if (userRepository.findById(userId).isEmpty()) {
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

        String prefix = "logo_owner_" + userId;
        String savedPath = fileStoragePort.storeFile(file, "companies/logos", prefix);

        profile.updateLogo("/uploads/" + savedPath);

        return mapToResponse(companyProfileRepository.save(profile));
    }

    // ==========================================================
    // LẤY DANH SÁCH CÔNG TY (CÓ PHÂN TRANG VÀ KIỂM TRA LƯỢT LIKE)
    // ==========================================================
    @Override
    @Transactional(readOnly = true)
    public PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable, Long currentUserId) {
        Page<CompanyProfile> profilePage = companyProfileRepository.findAll(pageable.toSpringPageable());

        // Sử dụng currentUserId để kiểm tra trạng thái Like của từng công ty
        List<CompanyProfileResponse> content = profilePage.getContent().stream()
                .map(profile -> mapToResponse(profile, currentUserId))
                .collect(Collectors.toList());

        return PageResponse.<CompanyProfileResponse>builder()
                .content(content)
                .totalElements(profilePage.getTotalElements())
                .totalPages(profilePage.getTotalPages())
                .pageNumber(profilePage.getNumber() + 1)
                .pageSize(profilePage.getSize())
                .build();
    }

    @Override
    @Transactional
    public void toggleLikeCompany(Long userId, Long companyId) {
        if (companyLikeRepository.isLikedByUser(userId, companyId)) {
            companyLikeRepository.removeLike(userId, companyId);
        } else {
            companyLikeRepository.addLike(userId, companyId);
        }
    }

    // ==========================================================
    // PRIVATE HELPER METHODS (MAPPING)
    // ==========================================================

    // Hàm phụ trợ khi không cần biết user đang đăng nhập là ai
    private CompanyProfileResponse mapToResponse(CompanyProfile profile) {
        return mapToResponse(profile, null);
    }

    // Hàm chính ánh xạ dữ liệu và đếm số lượt Like
    private CompanyProfileResponse mapToResponse(CompanyProfile profile, Long currentUserId) {
        int likeCount = companyLikeRepository.countLikesByCompany(profile.getId());
        boolean isLiked = false;

        // Nếu người dùng đã đăng nhập, kiểm tra xem họ đã Like công ty này chưa
        if (currentUserId != null) {
            isLiked = companyLikeRepository.isLikedByUser(currentUserId, profile.getId());
        }

        return CompanyProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .logoUrl(profile.getLogoUrl())
                .website(profile.getWebsite())
                .description(profile.getDescription())
                .verificationStatus(profile.getVerificationStatus())
                .likeCount(likeCount)
                .isLiked(isLiked)
                .activeJobsCount(0) // Cần tích hợp JobRepository nếu muốn đếm Job thật
                .build();
    }
}