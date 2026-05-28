package com.smartmatch.infrastructure.persistence.adapter;

import com.worklify.domain.auth.model.User;
import com.worklify.domain.auth.repository.UserRepository;
import com.smartmatch.infrastructure.persistence.entity.UserJpaEntity;
import com.smartmatch.infrastructure.persistence.mapper.UserEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;
    private final UserEntityMapper mapper;

    @Override
    public User save(User user) {
        UserJpaEntity entity = mapper.toEntity(user);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    // [ĐÃ THÊM] Triển khai phương thức đếm tổng số User
    @Override
    public long count() {
        return jpaRepository.count(); // Hàm count() có sẵn của Spring Data JPA
    }
}