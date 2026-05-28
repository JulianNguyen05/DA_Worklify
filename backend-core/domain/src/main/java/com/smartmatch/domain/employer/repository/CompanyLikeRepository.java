package com.smartmatch.domain.employer.repository;

public interface CompanyLikeRepository {
    boolean isLikedByUser(Long userId, Long companyId);
    void addLike(Long userId, Long companyId);
    void removeLike(Long userId, Long companyId);
    int countLikesByCompany(Long companyId);
}
