package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.domain.employer.model.CompanyProfile;
import com.smartmatch.domain.employer.model.VerificationStatus;
import com.smartmatch.domain.employer.repository.CompanyProfileRepository;
import com.smartmatch.infrastructure.persistence.mapper.CompanyProfileEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.CompanyProfileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CompanyProfileRepositoryAdapter implements CompanyProfileRepository {
    private final CompanyProfileJpaRepository jpaRepository;
    private final CompanyProfileEntityMapper mapper;

    @Override
    public CompanyProfile save(CompanyProfile companyProfile) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(companyProfile)));
    }

    @Override
    public Optional<CompanyProfile> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).map(mapper::toDomain);
    }

    @Override
    public Optional<CompanyProfile> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<CompanyProfile> findByVerificationStatus(VerificationStatus status) {
        // TRƯỚC ĐÂY: jpaRepository.findByVerificationStatus(status.name())

        // SỬA THÀNH (Bỏ .name() đi, truyền thẳng biến status):
        return jpaRepository.findByVerificationStatus(status)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}