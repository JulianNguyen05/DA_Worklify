package com.smartmatch.domain.candidate.repository;

import com.smartmatch.domain.candidate.model.CandidateProfile;
import java.util.Optional;

public interface CandidateProfileRepository {
    CandidateProfile save(CandidateProfile profile);
    Optional<CandidateProfile> findByUserId(Long userId);
}