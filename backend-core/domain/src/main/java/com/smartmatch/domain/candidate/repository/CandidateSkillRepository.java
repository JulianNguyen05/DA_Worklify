package com.smartmatch.domain.candidate.repository;

import com.smartmatch.domain.candidate.model.CandidateSkill;
import java.util.List;

public interface CandidateSkillRepository {
    CandidateSkill save(CandidateSkill candidateSkill);
    List<CandidateSkill> findByCandidateId(Long candidateId);
    void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId);
}