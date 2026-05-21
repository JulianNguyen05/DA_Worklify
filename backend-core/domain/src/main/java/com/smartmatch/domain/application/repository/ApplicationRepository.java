package com.smartmatch.domain.application.repository;

import com.smartmatch.domain.application.model.Application;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository {
    Application save(Application application);
    Optional<Application> findById(Long id);
    List<Application> findByJobId(Long jobId);
    List<Application> findByCvId(Long cvId);
    DomainPage<Application> findByJobId(Long jobId, DomainPageable pageable);
    DomainPage<Application> findByCandidateId(Long candidateId, DomainPageable pageable);
}