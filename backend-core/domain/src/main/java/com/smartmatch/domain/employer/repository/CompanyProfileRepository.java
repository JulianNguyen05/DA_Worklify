package com.smartmatch.domain.employer.repository;

import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.model.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ĐÃ SỬA THÀNH: org.springframework.data.domain.Pageable

import java.util.List;
import java.util.Optional;

public interface CompanyProfileRepository {
    CompanyProfile save(CompanyProfile companyProfile);
    Optional<CompanyProfile> findByUserId(Long userId);
    Optional<CompanyProfile> findById(Long id);
    List<CompanyProfile> findByVerificationStatus(VerificationStatus status);

    // Bây giờ hàm này đã sử dụng đúng Pageable của Spring
    Page<CompanyProfile> findAll(Pageable pageable);
}