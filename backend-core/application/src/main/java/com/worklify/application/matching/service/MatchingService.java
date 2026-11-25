package com.worklify.application.matching.service;

import com.worklify.application.matching.dto.CvJdScoreResponse;

public interface MatchingService {

    /**
     * Chấm điểm hồ sơ online của ứng viên so với một tin tuyển dụng.
     */
    CvJdScoreResponse scoreCandidateForJob(Long userId, Long jobId);
}
