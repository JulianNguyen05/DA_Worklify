package com.worklify.infrastructure.client;

import com.worklify.application.common.exception.AiServiceException;
import com.worklify.application.matching.dto.CvJdBatchRequest;
import com.worklify.application.matching.dto.CvJdBatchResponse;
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
import java.util.List;

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
        // Read timeout dài vì chấm hàng loạt (xếp hạng cả trăm ứng viên) trên CPU có thể mất cả phút.
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(180))
                .build();
    }

    @Override
    public CvJdScoreResponse score(CvJdScoreRequest request) {
        return post("/scoring/cv-jd", request, CvJdScoreResponse.class);
    }

    @Override
    public List<CvJdScoreResponse> scoreBatch(CvJdBatchRequest request) {
        CvJdBatchResponse response = post("/scoring/cv-jd/batch", request, CvJdBatchResponse.class);
        if (response.getResults() == null || response.getResults().size() != request.getCvs().size()) {
            throw new AiServiceException("Dịch vụ AI trả về kết quả chấm điểm không đầy đủ.");
        }
        return response.getResults();
    }

    private <T> T post(String path, Object body, Class<T> responseType) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Internal-Api-Key", internalApiKey);

        try {
            T response = restTemplate.postForObject(mlBaseUrl + path, new HttpEntity<>(body, headers), responseType);
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
