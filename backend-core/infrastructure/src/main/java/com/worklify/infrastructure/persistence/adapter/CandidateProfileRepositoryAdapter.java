package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.worklify.infrastructure.persistence.repository.CandidateProfileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CandidateProfileRepositoryAdapter implements CandidateProfileRepository {
    private final CandidateProfileJpaRepository jpaRepository;
    private final CandidateEntityMapper mapper;

    @Override
    public CandidateProfile save(CandidateProfile profile) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(profile)));
    }

    @Override
    public Optional<CandidateProfile> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).map(mapper::toDomain);
    }

    @Override
    public Optional<CandidateProfile> findById(Long id) {
        return Optional.empty();
    }
}