package com.worklify.domain.candidate.repository;
import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;

import java.util.Optional;
public interface CandidateProfileRepository {
    CandidateProfile save(CandidateProfile profile);
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findById(Long id);
    DomainPage<CandidateProfile> searchCandidates(String keyword, DomainPageable pageable);
}