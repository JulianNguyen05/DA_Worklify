// File: \backend-core\domain\src\main\java\com\smartmatch\domain\common\DomainPage.java
package com.worklify.domain.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class DomainPage<T> {
    private final List<T> content;
    private final long totalElements;
    private final int totalPages;
    private final int pageNumber;
    private final int pageSize;

    public int getNumber() {
        return this.pageNumber;
    }

    public int getSize() {
        return this.pageSize;
    }
}