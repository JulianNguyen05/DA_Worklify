package com.smartmatch.domain.candidate.repository;

import com.smartmatch.domain.candidate.model.CandidateSkill;
import java.util.List;
import java.util.Optional;

public interface CandidateSkillRepository {
    CandidateSkill save(CandidateSkill candidateSkill);
    List<CandidateSkill> findByCandidateId(Long candidateId);
    void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId);
    void deleteByCandidateId(Long candidateId);
    Optional<CandidateSkill> findByCandidateIdAndSkillId(Long candidateId, Long skillId);
}