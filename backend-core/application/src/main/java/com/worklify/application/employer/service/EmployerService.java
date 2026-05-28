package com.worklify.application.employer.service;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.employer.dto.CompanyProfileRequest;
import com.worklify.application.employer.dto.CompanyProfileResponse;
import com.worklify.domain.common.DomainPageable;
import org.springframework.web.multipart.MultipartFile;

public interface EmployerService {
    CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse getProfileByUserId(Long userId);
    CompanyProfileResponse uploadLogo(Long userId, MultipartFile file);
    PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable, Long currentUserId);
    void toggleLikeCompany(Long currentUserId, Long companyId);
}