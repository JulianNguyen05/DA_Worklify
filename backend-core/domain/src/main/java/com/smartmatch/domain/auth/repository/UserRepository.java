package com.smartmatch.domain.auth.repository;
import com.smartmatch.domain.auth.model.User;
import java.util.Optional;
public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}