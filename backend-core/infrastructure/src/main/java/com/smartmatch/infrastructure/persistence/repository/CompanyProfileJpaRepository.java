package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.domain.employer.model.VerificationStatus;
import com.smartmatch.infrastructure.persistence.entity.CompanyProfileJpaEntity;
import io.micrometer.common.KeyValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyProfileJpaRepository extends JpaRepository<CompanyProfileJpaEntity, Long> {
    Optional<CompanyProfileJpaEntity> findByUserId(Long userId);

    List<CompanyProfileJpaEntity> findByVerificationStatus(VerificationStatus status);
}
