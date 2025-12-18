package com.example.backend.security;

// =====================================================
// [종혁 코드] - 원본 그대로 복사
// =====================================================

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:mySecretKeyForJwtTokenMustBeLongEnough123456789}")
    private String secretKey;

    @Value("${jwt.access-token-validity:3600000}") // 1시간 (밀리초)
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity:604800000}") // 7일 (밀리초)
    private long refreshTokenValidity;

    private SecretKey key;

    @PostConstruct
    protected void init() {
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(encodedKey.getBytes());
    }

    // Access Token 생성
    public String createAccessToken(Long userId, String email, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    // Refresh Token 생성
    public String createRefreshToken(Long userId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    // 토큰에서 사용자 ID 추출
    public Long getUserId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    // 토큰에서 이메일 추출
    public String getEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    // 토큰에서 역할 추출
    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
