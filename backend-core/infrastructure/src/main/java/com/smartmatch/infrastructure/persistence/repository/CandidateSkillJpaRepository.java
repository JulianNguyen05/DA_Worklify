package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.CandidateSkillJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.CandidateSkillId; // Import class IdClass
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// SỬA: Thay Long bằng CandidateSkillId
public interface CandidateSkillJpaRepository extends JpaRepository<CandidateSkillJpaEntity, CandidateSkillId> {

    List<CandidateSkillJpaEntity> findByCandidateId(Long candidateId);

    Optional<CandidateSkillJpaEntity> findByCandidateIdAndSkillId(Long candidateId, Long skillId);

    void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId);

    void deleteByCandidateId(Long candidateId);
}