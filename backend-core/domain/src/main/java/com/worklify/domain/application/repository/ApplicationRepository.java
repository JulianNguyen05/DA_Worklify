package com.worklify.domain.application.repository;
import com.worklify.domain.application.model.Application;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import java.util.Optional;
public interface ApplicationRepository {
    Application save(Application application);
    Optional<Application> findById(Long id);
    DomainPage<Application> findByJobId(Long jobId, DomainPageable pageable);
    DomainPage<Application> findByCandidateId(Long candidateId, DomainPageable pageable);
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
    long countAll();
    long countByStatus(ApplicationStatus status);
}