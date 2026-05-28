package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.infrastructure.persistence.mapper.ApplicationEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.AiMatchScoreJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AiMatchScoreRepositoryAdapter implements AiMatchScoreRepository {
    private final AiMatchScoreJpaRepository jpaRepository;
    private final ApplicationEntityMapper mapper;

    @Override
    public AiMatchScore save(AiMatchScore score) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(score)));
    }

    @Override
    public Optional<AiMatchScore> findByApplicationId(Long applicationId) {
        return jpaRepository.findByApplicationId(applicationId).map(mapper::toDomain);
    }
}