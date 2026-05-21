package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.domain.candidate.model.CandidateSkill;
import com.smartmatch.domain.candidate.repository.CandidateSkillRepository;
import com.smartmatch.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.CandidateSkillJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CandidateSkillRepositoryAdapter implements CandidateSkillRepository {
    private final CandidateSkillJpaRepository jpaRepository;
    private final CandidateEntityMapper mapper;

    @Override
    public CandidateSkill save(CandidateSkill candidateSkill) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(candidateSkill)));
    }

    @Override
    public List<CandidateSkill> findByCandidateId(Long candidateId) {
        return jpaRepository.findByCandidateId(candidateId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId) {
        jpaRepository.deleteByCandidateIdAndSkillId(candidateId, skillId);
    }
}