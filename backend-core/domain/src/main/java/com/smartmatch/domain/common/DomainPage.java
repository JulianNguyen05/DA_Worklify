package com.smartmatch.domain.common;

import java.util.List;

public interface DomainPage<T> {
    List<T> getContent();
    long getTotalElements();
    int getTotalPages();
    int getNumber();
    int getSize();
}
