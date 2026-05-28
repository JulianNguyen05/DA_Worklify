package com.smartmatch.application.employer.service;
import com.smartmatch.application.employer.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.worklify.domain.common.DomainPageable;
import org.springframework.web.multipart.MultipartFile;

public interface EmployerService {
    CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse getProfileByUserId(Long userId);
    CompanyProfileResponse uploadLogo(Long userId, MultipartFile file);

    PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable, Long userId);

    void toggleLikeCompany(Long currentUserId, Long companyId);
}