package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.domain.candidate.model.Skill;
import com.smartmatch.domain.candidate.repository.SkillRepository;
import com.smartmatch.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.SkillJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SkillRepositoryAdapter implements SkillRepository {
    private final SkillJpaRepository jpaRepository;
    private final CandidateEntityMapper mapper;

    @Override
    public Skill save(Skill skill) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(skill)));
    }

    @Override
    public Optional<Skill> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Skill> findByName(String name) {
        return jpaRepository.findByName(name).map(mapper::toDomain);
    }

    @Override
    public List<Skill> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}