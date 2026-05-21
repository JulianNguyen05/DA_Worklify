package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobJpaRepository extends JpaRepository<SavedJobJpaEntity, Long> {
    Optional<SavedJobJpaEntity> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    Page<SavedJobJpaEntity> findByCandidateId(Long candidateId, Pageable pageable);
}
