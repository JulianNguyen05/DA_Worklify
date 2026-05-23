package com.smartmatch.domain.candidate.repository;

import com.smartmatch.domain.candidate.model.Skill;

import java.util.List;
import java.util.Optional;

public interface SkillRepository {

    Skill save(Skill skill);

    Optional<Skill> findById(Long id);

    Optional<Skill> findByName(String name);

    List<Skill> findAll();

    void deleteById(Long id);

    Optional<Skill> findByNameIgnoreCase(String name);
}