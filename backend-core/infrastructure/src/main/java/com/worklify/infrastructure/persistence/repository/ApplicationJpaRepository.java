package com.worklify.infrastructure.persistence.repository;

import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationJpaRepository extends JpaRepository<ApplicationJpaEntity, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    Page<ApplicationJpaEntity> findByJobId(Long jobId, Pageable pageable);
    Page<ApplicationJpaEntity> findByCandidateId(Long candidateId, Pageable pageable);
    long countByStatus(ApplicationStatus status);
}