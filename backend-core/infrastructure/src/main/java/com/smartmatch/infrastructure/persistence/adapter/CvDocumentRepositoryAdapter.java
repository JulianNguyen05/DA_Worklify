package com.smartmatch.infrastructure.persistence.adapter;

import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import com.smartmatch.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.CvDocumentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CvDocumentRepositoryAdapter implements CvDocumentRepository {
    private final CvDocumentJpaRepository jpaRepository;
    private final CandidateEntityMapper mapper;

    @Override
    public CvDocument save(CvDocument cvDocument) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(cvDocument)));
    }

    @Override
    public Optional<CvDocument> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<CvDocument> findByCandidateId(Long candidateId) {
        return jpaRepository.findByCandidateId(candidateId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}