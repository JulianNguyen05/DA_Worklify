package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.SkillJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillJpaRepository extends JpaRepository<SkillJpaEntity, Long> {
    Optional<SkillJpaEntity> findByName(String name);
    Optional<SkillJpaEntity> findByNameIgnoreCase(String name);
}