package com.worklify.domain.employer.repository;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.model.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ĐÃ SỬA THÀNH: org.springframework.data.domain.Pageable

import java.util.List;
import java.util.Optional;

public interface CompanyProfileRepository {
    CompanyProfile save(CompanyProfile companyProfile);
    Optional<CompanyProfile> findByUserId(Long userId);
    Optional<CompanyProfile> findById(Long id);
    List<CompanyProfile> findByVerificationStatus(VerificationStatus status);
    DomainPage<CompanyProfile> findAll(DomainPageable pageable);
}