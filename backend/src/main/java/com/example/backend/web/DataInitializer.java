package com.example.backend.web;

import com.example.backend.entity.user.Role;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void run(String... args) throws Exception {



        // 1️⃣ 관리자 계정 생성
        {
            String email = "admin@test.com";
            if (!userRepository.existsByEmail(email)) {
                User admin = User.builder()
                        .email(email)
                        .username("Admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                log.info("✅ 관리자 계정 생성 완료: {}", email);
            }
        }

        // 2️⃣ 일반 테스트 유저 생성
        {
            String email = "user@test.com";
            if (!userRepository.existsByEmail(email)) {
                User user = User.builder()
                        .email(email)
                        .username("TestUser")
                        .password(passwordEncoder.encode("user123"))
                        .role(Role.USER)
                        .build();
                userRepository.save(user);
                log.info("✅ 테스트 유저 계정 생성 완료: {}", email);
            }
        }
    }
}
