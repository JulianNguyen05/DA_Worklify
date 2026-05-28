// ============================================================
// File: \backend-core\application\src\main\java\com\smartmatch\application\employer\service\impl\EmployerServiceImpl.java
// ============================================================

package com.worklify.application.employer.service.impl;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.common.port.FileStoragePort;
import com.worklify.application.employer.dto.CompanyProfileRequest;
import com.worklify.application.employer.dto.CompanyProfileResponse;
import com.worklify.application.employer.service.EmployerService;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.DomainPage;
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
        return mapToResponse(companyProfileRepository.save(profile), null);
    }

    @Override
    public CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp."));

        profile.reviseProfile(request.getCompanyName(), request.getWebsite(), request.getDescription());
        return mapToResponse(companyProfileRepository.save(profile), null);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfileByUserId(Long userId) {
        return mapToResponse(
                companyProfileRepository.findByUserId(userId)
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin doanh nghiệp.")),
                null
        );
    }

    @Override
    public CompanyProfileResponse uploadLogo(Long userId, MultipartFile file) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng tạo thông tin doanh nghiệp trước khi tải logo."));

        String savedPath = fileStoragePort.storeFile(file, "companies/logos", "logo_owner_" + userId);
        profile.updateLogo("/uploads/" + savedPath);

        return mapToResponse(companyProfileRepository.save(profile), null);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable, Long currentUserId) {
        // Dùng DomainPage — không import Spring Page ở tầng Application
        DomainPage<CompanyProfile> page = companyProfileRepository.findAll(pageable);

        return PageResponse.<CompanyProfileResponse>builder()
                .content(page.getContent().stream()
                        .map(p -> mapToResponse(p, currentUserId))
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getPageNumber())
                .pageSize(page.getPageSize())
                .build();
    }

    @Override
    public void toggleLikeCompany(Long userId, Long companyId) {
        if (companyLikeRepository.isLikedByUser(userId, companyId)) {
            companyLikeRepository.removeLike(userId, companyId);
        } else {
            companyLikeRepository.addLike(userId, companyId);
        }
    }

    // ====================================================
    // PRIVATE HELPERS
    // ====================================================

    private CompanyProfileResponse mapToResponse(CompanyProfile profile, Long currentUserId) {
        int likeCount = companyLikeRepository.countLikesByCompany(profile.getId());
        boolean isLiked = currentUserId != null
                && companyLikeRepository.isLikedByUser(currentUserId, profile.getId());

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
                .activeJobsCount(0) // TODO: Tích hợp JobRepository để đếm số Job đang ACTIVE
                .build();
    }
}