package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationJpaRepository extends JpaRepository<ApplicationJpaEntity, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    List<ApplicationJpaEntity> findByJobId(Long jobId);
    List<ApplicationJpaEntity> findByCandidateId(Long candidateId);
}
