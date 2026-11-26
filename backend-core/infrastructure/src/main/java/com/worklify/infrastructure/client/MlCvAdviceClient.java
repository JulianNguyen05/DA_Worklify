package com.worklify.infrastructure.client;

import com.worklify.application.common.exception.AiServiceException;
import com.worklify.application.matching.dto.CvAdviceRequest;
import com.worklify.application.matching.dto.CvAdviceResponse;
import com.worklify.application.matching.port.CvAdvicePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Gọi agent gợi ý sửa CV ở backend-ml POST /agent/cv-advice. LLM chạy bằng CPU (Ollama) nên
 * một lượt có thể mất 1-2 phút -> read timeout dài hơn hẳn các API chấm điểm.
 */
@Slf4j
@Component
public class MlCvAdviceClient implements CvAdvicePort {

    private final RestTemplate restTemplate;

    @Value("${worklify.ml.base-url}")
    private String mlBaseUrl;

    @Value("${worklify.internal.api-key:local-dev-only-change-me}")
    private String internalApiKey;

    public MlCvAdviceClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(300))
                .build();
    }

    @Override
    public CvAdviceResponse advise(CvAdviceRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Internal-Api-Key", internalApiKey);

        try {
            CvAdviceResponse response = restTemplate.postForObject(
                    mlBaseUrl + "/agent/cv-advice", new HttpEntity<>(request, headers), CvAdviceResponse.class);
            if (response == null) {
                throw new AiServiceException("Không nhận được gợi ý từ trợ lý AI.");
            }
            return response;
        } catch (HttpStatusCodeException ex) {
            log.warn("backend-ml trả lỗi khi gợi ý sửa CV: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            if (ex.getStatusCode().value() == HttpStatus.SERVICE_UNAVAILABLE.value()) {
                // 503 từ backend-ml nghĩa là Ollama chưa chạy hoặc chưa tải model
                throw new AiServiceException("Trợ lý AI (LLM) đang không hoạt động, vui lòng thử lại sau.", ex);
            }
            throw new AiServiceException("Trợ lý AI không tạo được gợi ý lúc này, vui lòng thử lại sau.", ex);
        } catch (RestClientException ex) {
            log.error("Không kết nối được backend-ml tại {}", mlBaseUrl, ex);
            throw new AiServiceException("Dịch vụ AI đang không hoạt động, vui lòng thử lại sau.", ex);
        }
    }
}
