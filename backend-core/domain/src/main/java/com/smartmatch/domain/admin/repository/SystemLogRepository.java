package com.smartmatch.domain.admin.repository;
import com.smartmatch.domain.admin.model.SystemLog;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
public interface SystemLogRepository {
    SystemLog save(SystemLog systemLog);
    DomainPage<SystemLog> findAll(DomainPageable pageable);
}