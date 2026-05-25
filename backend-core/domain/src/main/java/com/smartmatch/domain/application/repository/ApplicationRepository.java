package com.smartmatch.domain.application.repository;
import com.smartmatch.domain.application.model.*;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import java.util.Optional;
public interface ApplicationRepository {
    Application save(Application application);
    Optional<Application> findById(Long id);
    DomainPage<Application> findByJobId(Long jobId, DomainPageable pageable);
    DomainPage<Application> findByCandidateId(Long candidateId, DomainPageable pageable);
    long countAll();
    long countByStatus(ApplicationStatus status);
}