// File: \backend-core\domain\src\main\java\com\smartmatch\domain\job\repository\SavedJobRepository.java
package com.smartmatch.domain.job.repository;

import com.smartmatch.domain.job.model.SavedJob;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import java.util.Optional;

public interface SavedJobRepository {
    SavedJob save(SavedJob savedJob);

    Optional<SavedJob> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    DomainPage<SavedJob> findByCandidateId(Long candidateId, DomainPageable pageable);

    void delete(SavedJob savedJob);
}