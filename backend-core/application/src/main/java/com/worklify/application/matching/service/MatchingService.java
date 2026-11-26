package com.worklify.application.matching.service;

import com.worklify.application.matching.dto.ApplicationMatchResponse;
import com.worklify.application.matching.dto.CvJdScoreResponse;

import java.util.List;

public interface MatchingService {

    /**
     * Chấm điểm hồ sơ online của ứng viên đang đăng nhập so với một tin tuyển dụng.
     *
     * @param candidateEmail email của ứng viên lấy từ JWT (không tin userId do client gửi lên)
     */
    CvJdScoreResponse scoreCandidateForJob(String candidateEmail, Long jobId);

    /**
     * Chấm điểm và xếp hạng (điểm cao trước) mọi hồ sơ ứng tuyển của một tin tuyển dụng.
     * Chỉ nhà tuyển dụng sở hữu tin này mới được xem.
     *
     * @param employerEmail email của nhà tuyển dụng lấy từ JWT
     */
    List<ApplicationMatchResponse> rankApplicationsForJob(String employerEmail, Long jobId);
}
