package com.worklify.infrastructure.client;

import com.worklify.application.common.exception.AiServiceException;
import com.worklify.application.matching.dto.CvJdScoreRequest;
import com.worklify.application.matching.dto.CvJdScoreResponse;
import com.worklify.application.matching.port.CvJdScoringPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Gọi sang backend-ml POST /scoring/cv-jd, xác thực bằng header X-Internal-Api-Key
 * (cùng key với /api/internal/** bên backend-core).
 */
@Slf4j
@Component
public class MlCvJdScoringClient implements CvJdScoringPort {

    private final RestTemplate restTemplate;

    @Value("${worklify.ml.base-url}")
    private String mlBaseUrl;

    @Value("${worklify.internal.api-key:local-dev-only-change-me}")
    private String internalApiKey;

    public MlCvJdScoringClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(60))
                .build();
    }

    @Override
    public CvJdScoreResponse score(CvJdScoreRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Internal-Api-Key", internalApiKey);

        try {
            CvJdScoreResponse response = restTemplate.postForObject(
                    mlBaseUrl + "/scoring/cv-jd", new HttpEntity<>(request, headers), CvJdScoreResponse.class);
            if (response == null) {
                throw new AiServiceException("Không nhận được kết quả chấm điểm từ dịch vụ AI.");
            }
            return response;
        } catch (HttpStatusCodeException ex) {
            log.warn("backend-ml trả lỗi khi chấm điểm: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new AiServiceException("Dịch vụ AI không chấm điểm được lúc này, vui lòng thử lại sau.", ex);
        } catch (RestClientException ex) {
            log.error("Không kết nối được backend-ml tại {}", mlBaseUrl, ex);
            throw new AiServiceException("Dịch vụ AI đang không hoạt động, vui lòng thử lại sau.", ex);
        }
    }
}
