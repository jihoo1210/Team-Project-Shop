package com.example.backend.oauth;

// =====================================================
// [진용 추가] - OAuth2 로그인 성공 핸들러 (전체 새로 작성)
// 구글/네이버 로그인 성공 시 JWT 토큰 발급
// =====================================================

import com.example.backend.entity.user.Role;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        // 어떤 provider인지 확인 (구글 vs 네이버)
        String provider;
        String providerId;
        String email;
        String name;

        if (attributes.containsKey("response")) {
            // 네이버
            Map<String, Object> naverResponse = (Map<String, Object>) attributes.get("response");
            provider = "naver";
            providerId = (String) naverResponse.get("id");
            email = (String) naverResponse.get("email");
            name = (String) naverResponse.get("name");
        } else {
            // 구글
            provider = "google";
            providerId = (String) attributes.get("sub");
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        }

        log.info("OAuth2 로그인 성공 - provider: {}, email: {}", provider, email);

        // DB에서 유저 찾기 또는 새로 생성
        User user = findOrCreateUser(provider, providerId, email, name);

        // JWT 토큰 생성 (종혁 코드의 JwtTokenProvider 사용)
        String accessToken = jwtTokenProvider.createAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name()
        );
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        // 쿠키에 토큰 저장
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(3600); // 1시간

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(604800); // 7일

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        // 로그인 성공 후 리다이렉트 (프론트엔드 URL로 변경 가능)
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/login?result=success");
    }

    private User findOrCreateUser(String provider, String providerId, String email, String name) {
        // provider + providerId로 기존 유저 찾기
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // 새 유저 생성
        User newUser = User.builder()
                .email(email)
                .username(name)
                .provider(provider)
                .providerId(providerId)
                .role(Role.USER)
                .build();

        return userRepository.save(newUser);
    }
}
