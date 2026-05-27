package com.smartmatch.domain.common;

import org.springframework.data.domain.Pageable;

public interface DomainPageable {
    int getPageNumber();
    int getPageSize();

    Pageable toSpringPageable();
}
