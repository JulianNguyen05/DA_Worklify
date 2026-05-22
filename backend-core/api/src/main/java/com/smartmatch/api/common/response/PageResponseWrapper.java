package com.smartmatch.api.common.response;

import com.smartmatch.application.common.dto.PageResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PageResponseWrapper<T> {
    @Builder.Default
    private int code = 200;
    @Builder.Default
    private String message = "Thành công";

    private PageResponse<T> data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> PageResponseWrapper<T> success(PageResponse<T> pageData) {
        return PageResponseWrapper.<T>builder()
                .data(pageData)
                .build();
    }
}