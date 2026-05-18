package com.smartmatch.domain.application.repository;

import com.smartmatch.domain.application.model.Application;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationRepository {
    Application save(Application application);
    Optional<Application> findById(Long id);
    List<Application> findByJobId(Long jobId);
    List<Application> findByCvId(Long cvId);
    Page<Application> findByJobId(Long jobId, Pageable pageable);
    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);
}