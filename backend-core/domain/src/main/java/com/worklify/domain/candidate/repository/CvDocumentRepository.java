package com.worklify.domain.candidate.repository;

import com.worklify.domain.candidate.model.CvDocument;
import java.util.List;
import java.util.Optional;

public interface CvDocumentRepository {
    CvDocument save(CvDocument cvDocument);
    Optional<CvDocument> findById(Long id);
    List<CvDocument> findByCandidateId(Long candidateId);
    void deleteById(Long id);
}