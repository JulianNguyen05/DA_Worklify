package com.worklify.application.matching.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload gửi sang backend-ml POST /scoring/cv-jd/batch: nhiều CV chấm với cùng một JD.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CvJdBatchRequest {
    private CvJdScoreRequest.Jd jd;
    private List<CvJdScoreRequest.Cv> cvs;
}
