package com.worklify.infrastructure.messaging;

/**
 * DTO đại diện cho dữ liệu cấu trúc JSON trả về từ AI Server.
 */
public record AiMatchResultPayload(
        Long applicationId,
        Float confidenceScore,
        String analysisDetails
) {}