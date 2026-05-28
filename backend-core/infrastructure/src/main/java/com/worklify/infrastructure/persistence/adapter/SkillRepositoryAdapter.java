package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.candidate.model.Skill;
import com.worklify.domain.candidate.repository.SkillRepository;
import com.worklify.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.worklify.infrastructure.persistence.repository.SkillJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SkillRepositoryAdapter implements SkillRepository {

    private final SkillJpaRepository jpaRepository; // Giữ lại một trường duy nhất đại diện cho JPA Repository
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

    @Override
    public Optional<Skill> findByNameIgnoreCase(String name) {
        // ĐÃ SỬA: Sử dụng mapper::toDomain đồng bộ với kiến trúc thay vì dùng từ khóa new thủ công
        return jpaRepository.findByNameIgnoreCase(name)
                .map(mapper::toDomain);
    }
}