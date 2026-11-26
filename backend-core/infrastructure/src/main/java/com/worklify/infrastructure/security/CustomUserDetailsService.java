package com.worklify.infrastructure.security;

import com.worklify.domain.auth.model.User;
import com.worklify.domain.auth.model.UserStatus;
import com.worklify.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // Tài khoản bị khoá → accountNonLocked = false; JwtAuthenticationFilter sẽ không xác thực token của họ
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail().value())
                .password(user.getPasswordHash())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .accountLocked(user.getStatus() == UserStatus.BANNED)
                .build();
    }
}
