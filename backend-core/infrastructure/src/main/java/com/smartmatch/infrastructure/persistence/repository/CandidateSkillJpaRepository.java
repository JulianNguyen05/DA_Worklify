package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.CandidateSkillJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateSkillJpaRepository extends JpaRepository<CandidateSkillJpaEntity, Long> {
    List<CandidateSkillJpaEntity> findByCandidateId(Long candidateId);
    void deleteByCandidateIdAndSkillId(Long candidateId, Integer skillId);
}
