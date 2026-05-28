package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.model.VerificationStatus;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.infrastructure.persistence.mapper.CompanyProfileEntityMapper;
import com.worklify.infrastructure.persistence.repository.CompanyProfileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; // BỔ SUNG IMPORT
import org.springframework.data.domain.Pageable; // BỔ SUNG IMPORT
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
        return jpaRepository.findByVerificationStatus(status)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public DomainPage<CompanyProfile> findAll(DomainPageable pageable) {
        return null;
    }

    // ==========================================================
    // BỔ SUNG: Triển khai hàm findAll phục vụ phân trang cho DDD
    // ==========================================================
    @Override
    public Page<CompanyProfile> findAll(Pageable pageable) {
        // 1. jpaRepository.findAll(pageable) sẽ lấy từ DB lên một Page<CompanyProfileEntity>
        // 2. Sử dụng hàm .map() tích hợp sẵn của Spring Page để tự động chuyển đổi
        //    từng Entity bên trong thành Domain Model thông qua mapper mà không làm mất cấu trúc phân trang.
        return jpaRepository.findAll(pageable).map(mapper::toDomain);
    }
}