package com.smartmatch.domain.admin.repository;

import com.smartmatch.domain.admin.model.SystemLog;
import java.util.List;

public interface SystemLogRepository {
    SystemLog save(SystemLog systemLog);
    List<SystemLog> findAll();
    List<SystemLog> findByUserId(Long userId);
}