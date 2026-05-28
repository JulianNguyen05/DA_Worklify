package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.employer.repository.CompanyLikeRepository;
import com.worklify.infrastructure.persistence.entity.CompanyLikeJpaEntity;
import com.worklify.infrastructure.persistence.repository.CompanyLikeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CompanyLikeRepositoryAdapter implements CompanyLikeRepository {

    private final CompanyLikeJpaRepository companyLikeJpaRepository;

    @Override
    public boolean isLikedByUser(Long userId, Long companyId) {
        return companyLikeJpaRepository.existsByUserIdAndCompanyId(userId, companyId);
    }

    @Override
    @Transactional
    public void addLike(Long userId, Long companyId) {
        // Kiểm tra an toàn để tránh lỗi Duplicate Key
        if (!isLikedByUser(userId, companyId)) {
            CompanyLikeJpaEntity entity = CompanyLikeJpaEntity.builder()
                    .userId(userId)
                    .companyId(companyId)
                    .build();
            companyLikeJpaRepository.save(entity);
        }
    }

    @Override
    @Transactional
    public void removeLike(Long userId, Long companyId) {
        companyLikeJpaRepository.deleteByUserIdAndCompanyId(userId, companyId);
    }

    @Override
    public int countLikesByCompany(Long companyId) {
        return companyLikeJpaRepository.countByCompanyId(companyId);
    }
}