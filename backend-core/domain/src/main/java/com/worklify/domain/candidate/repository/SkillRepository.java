package com.worklify.domain.candidate.repository;

import com.worklify.domain.candidate.model.Skill;

import java.util.List;
import java.util.Optional;

public interface SkillRepository {
    Skill save(Skill skill);
    Optional<Skill> findById(Long id);
    Optional<Skill> findByName(String name);
    Optional<Skill> findByNameIgnoreCase(String name);
    List<Skill> findAll();
    void deleteById(Long id);
}