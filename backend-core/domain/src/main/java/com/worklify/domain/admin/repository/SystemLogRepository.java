package com.worklify.domain.admin.repository;
import com.worklify.domain.admin.model.SystemLog;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
public interface SystemLogRepository {
    SystemLog save(SystemLog systemLog);
    DomainPage<SystemLog> findAll(DomainPageable pageable);
}