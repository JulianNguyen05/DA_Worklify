package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.CvDocumentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CvDocumentJpaRepository extends JpaRepository<CvDocumentJpaEntity, Long> {
    List<CvDocumentJpaEntity> findByCandidateId(Long candidateId);
}