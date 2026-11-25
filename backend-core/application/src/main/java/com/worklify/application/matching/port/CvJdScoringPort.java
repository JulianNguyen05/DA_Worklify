package com.worklify.application.matching.port;

import com.worklify.application.matching.dto.CvJdScoreRequest;
import com.worklify.application.matching.dto.CvJdScoreResponse;

/**
 * Cổng ra dịch vụ AI chấm điểm mức độ phù hợp giữa CV và JD (hiện thực bởi backend-ml).
 */
public interface CvJdScoringPort {
    CvJdScoreResponse score(CvJdScoreRequest request);
}
