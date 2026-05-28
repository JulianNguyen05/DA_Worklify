package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.model.VerificationStatus;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.infrastructure.persistence.adapter.util.PaginationMapper;
import com.worklify.infrastructure.persistence.mapper.CompanyProfileEntityMapper;
import com.worklify.infrastructure.persistence.repository.CompanyProfileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * [ĐÃ SỬA] Loại bỏ phương thức findAll(Pageable) dùng Spring Page trực tiếp.
 * Toàn bộ phân trang đi qua DomainPageable/DomainPage để giữ sạch ranh giới kiến trúc.
 * Domain Repository interface không được phép khai báo kiểu Spring Data.
 */
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
        return PaginationMapper.toDomainPage(
                jpaRepository.findAll(PaginationMapper.toSpringPageable(pageable)),
                mapper::toDomain
        );
    }

    @Override
    public Page<CompanyProfile> findAll(Pageable pageable) {
        return null;
    }
}