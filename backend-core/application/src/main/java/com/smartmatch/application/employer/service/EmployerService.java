package com.smartmatch.application.employer.service;
import com.smartmatch.application.common.dto.FileData;
import com.smartmatch.application.employer.dto.*;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.employer.model.VerificationStatus;
import org.springframework.web.multipart.MultipartFile;

public interface EmployerService {
    CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request);
    CompanyProfileResponse getProfileByUserId(Long userId);
    CompanyProfileResponse uploadLogo(Long userId, MultipartFile file);

    PageResponse<CompanyProfileResponse> getAllProfiles(DomainPageable pageable);
}