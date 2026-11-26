package com.worklify.application.matching.port;

import com.worklify.application.matching.dto.CvJdBatchRequest;
import com.worklify.application.matching.dto.CvJdScoreRequest;
import com.worklify.application.matching.dto.CvJdScoreResponse;

import java.util.List;

/**
 * Cổng ra dịch vụ AI chấm điểm mức độ phù hợp giữa CV và JD (hiện thực bởi backend-ml).
 */
public interface CvJdScoringPort {

    CvJdScoreResponse score(CvJdScoreRequest request);

    /** Chấm nhiều CV với cùng một JD; kết quả cùng thứ tự với {@code request.cvs}. */
    List<CvJdScoreResponse> scoreBatch(CvJdBatchRequest request);
}
