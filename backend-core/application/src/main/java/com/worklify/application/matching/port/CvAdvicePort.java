package com.worklify.application.matching.port;

import com.worklify.application.matching.dto.CvAdviceRequest;
import com.worklify.application.matching.dto.CvAdviceResponse;

/**
 * Cổng ra agent gợi ý sửa CV theo JD (hiện thực bởi backend-ml, LLM chạy bằng Ollama).
 */
public interface CvAdvicePort {
    CvAdviceResponse advise(CvAdviceRequest request);
}
