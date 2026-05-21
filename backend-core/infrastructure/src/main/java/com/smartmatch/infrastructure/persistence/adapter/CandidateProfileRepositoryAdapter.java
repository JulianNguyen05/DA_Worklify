package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.domain.candidate.model.CandidateProfile;
import com.smartmatch.domain.candidate.repository.CandidateProfileRepository;
import com.smartmatch.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.CandidateProfileJpaRepository;
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
}