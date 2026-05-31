package com.worklify.infrastructure.persistence.repository;

import com.worklify.domain.employer.model.VerificationStatus;
import com.worklify.infrastructure.persistence.entity.CompanyProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyProfileJpaRepository extends JpaRepository<CompanyProfileJpaEntity, Long> {
    Optional<CompanyProfileJpaEntity> findByUserId(Long userId);
    List<CompanyProfileJpaEntity> findByVerificationStatus(VerificationStatus status);
    Optional<CompanyProfileJpaEntity> findFirstByUserId(Long userId);
}