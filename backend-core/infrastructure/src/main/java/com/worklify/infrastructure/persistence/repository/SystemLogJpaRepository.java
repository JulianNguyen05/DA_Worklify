package com.worklify.infrastructure.persistence.repository;

import com.worklify.infrastructure.persistence.entity.SystemLogJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SystemLogJpaRepository extends JpaRepository<SystemLogJpaEntity, Long> {
    List<SystemLogJpaEntity> findByUserId(Long userId);
}