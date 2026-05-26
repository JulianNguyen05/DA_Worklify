package com.smartmatch.domain.employer.repository;
import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.model.VerificationStatus;

import java.util.List;
import java.util.Optional;
public interface CompanyProfileRepository {
    CompanyProfile save(CompanyProfile companyProfile);
    Optional<CompanyProfile> findByUserId(Long userId);
    Optional<CompanyProfile> findById(Long id);
    List<CompanyProfile> findByVerificationStatus(VerificationStatus status);
}