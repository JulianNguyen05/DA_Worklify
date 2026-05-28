package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.CompanyLikeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyLikeJpaRepository extends JpaRepository<CompanyLikeJpaEntity, Long> {
    boolean existsByUserIdAndCompanyId(Long userId, Long companyId);
    void deleteByUserIdAndCompanyId(Long userId, Long companyId);
    int countByCompanyId(Long companyId);
}
