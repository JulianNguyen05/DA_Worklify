package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.SkillJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillJpaRepository extends JpaRepository<SkillJpaEntity, Integer> {
    Optional<SkillJpaEntity> findByName(String name);
}
