package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobJpaRepository extends JpaRepository<SavedJobJpaEntity, Long> {
    Optional<SavedJobJpaEntity> findByCandidateIdAndJobId(Long candidateId, Long jobId);
    Page<SavedJobJpaEntity> findByCandidateIdOrderBySavedAtDesc(Long candidateId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT s.jobId FROM SavedJobJpaEntity s WHERE s.candidateId = :candidateId")
    java.util.List<Long> findJobIdsByCandidateId(@org.springframework.data.repository.query.Param("candidateId") Long candidateId);
}