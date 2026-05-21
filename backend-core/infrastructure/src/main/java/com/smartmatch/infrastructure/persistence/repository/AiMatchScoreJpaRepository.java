package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.AiMatchScoreJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AiMatchScoreJpaRepository extends JpaRepository<AiMatchScoreJpaEntity, Long> {
    Optional<AiMatchScoreJpaEntity> findByApplicationId(Long applicationId);
}
