package com.worklify.application.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kết quả từ backend-ml POST /scoring/cv-jd/batch, cùng thứ tự với danh sách CV đã gửi.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CvJdBatchResponse {
    private List<CvJdScoreResponse> results;
}
