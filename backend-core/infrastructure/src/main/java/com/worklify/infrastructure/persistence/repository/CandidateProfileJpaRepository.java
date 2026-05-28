package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.CandidateProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileJpaRepository extends JpaRepository<CandidateProfileJpaEntity, Long> {
    Optional<CandidateProfileJpaEntity> findByUserId(Long userId);
}