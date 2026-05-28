package com.worklify.infrastructure.persistence.adapter.util;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PaginationMapper {

    public static Pageable toSpringPageable(DomainPageable domainPageable) {
        if (domainPageable == null) {
            return Pageable.unpaged();
        }
        return PageRequest.of(domainPageable.getPageNumber(), domainPageable.getPageSize());
    }

    public static <T, E> DomainPage<T> toDomainPage(Page<E> springPage, Function<E, T> mapperFunction) {
        List<T> content = springPage.getContent().stream()
                .map(mapperFunction)
                .collect(Collectors.toList());

        // Sử dụng constructor 5 tham số của DomainPage đã được định nghĩa ở tầng Domain
        return new DomainPage<>(
                content,
                springPage.getTotalElements(),
                springPage.getTotalPages(),
                springPage.getNumber(),
                springPage.getSize()
        );
    }
}