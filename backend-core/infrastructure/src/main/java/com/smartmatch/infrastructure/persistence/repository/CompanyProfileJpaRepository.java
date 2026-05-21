package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.CompanyProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyProfileJpaRepository extends JpaRepository<CompanyProfileJpaEntity, Long> {
    Optional<CompanyProfileJpaEntity> findByUserId(Long userId);
}
