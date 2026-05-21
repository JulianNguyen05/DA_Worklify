package com.smartmatch.domain.employer.repository;
import com.smartmatch.domain.employer.model.CompanyProfile;
import java.util.Optional;
public interface CompanyProfileRepository {
    CompanyProfile save(CompanyProfile companyProfile);
    Optional<CompanyProfile> findByUserId(Long userId);
    Optional<CompanyProfile> findById(Long id);
}