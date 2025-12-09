package com.example.backend.repository;

import com.example.backend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // =====================================================
    // [종혁 코드] - 기존 메서드
    // =====================================================

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // =====================================================
    // [진용 추가] - 소셜 로그인용 메서드
    // =====================================================

    // provider와 providerId로 유저 찾기 (소셜 로그인)
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
