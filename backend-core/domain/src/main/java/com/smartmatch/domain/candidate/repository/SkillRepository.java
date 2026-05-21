package com.smartmatch.domain.candidate.repository;

import com.smartmatch.domain.candidate.model.Skill;
import java.util.List;
import java.util.Optional;

public interface SkillRepository {
    Skill save(Skill skill);
    Optional<Skill> findByName(String name);
    List<Skill> findAll();
    void deleteById(Long id);
}