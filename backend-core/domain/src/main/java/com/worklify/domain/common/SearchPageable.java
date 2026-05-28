package com.worklify.domain.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class SearchPageable implements DomainPageable {
    private final int page;
    private final int size;

    public SearchPageable(int page, int size) {
        this.page = page;
        this.size = size;
    }

    @Override
    public int getPageNumber() {
        return this.page;
    }

    @Override
    public int getPageSize() {
        return this.size;
    }

    @Override
    public Pageable toSpringPageable() {
        return PageRequest.of(this.page, this.size);
    }
}