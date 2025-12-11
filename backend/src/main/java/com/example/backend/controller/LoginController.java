package com.example.backend.controller;

// =====================================================
// [진용 코드] - OAuth2 + JWT 통합 로그인 컨트롤러
// =====================================================

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/")
    public ResponseEntity<?> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OAuth2 Login Test API");
        response.put("googleLoginUrl", "/oauth2/authorization/google");
        response.put("naverLoginUrl", "/oauth2/authorization/naver");
        return ResponseController.success(response);
    }

    // =====================================================
    // [진용 수정] - JWT 토큰으로 유저 정보 조회
    // =====================================================
    @GetMapping("/login/success")
    public ResponseEntity<?> loginSuccess(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Login Successful!");

        // 쿠키에서 accessToken 가져오기
        String accessToken = getTokenFromCookie(request, "accessToken");

        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            Long userId = jwtTokenProvider.getUserId(accessToken);
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.put("provider", user.getProvider());
                response.put("name", user.getUsername());
                response.put("email", user.getEmail());
                response.put("accessToken", accessToken);
            }
        }

        return ResponseController.success(response);
    }

    @GetMapping("/login/failure")
    public ResponseEntity<?> loginFailure() {
        return ResponseController.fail("Login Failed");
    }

    // =====================================================
    // [진용 수정] - JWT 토큰으로 유저 정보 조회
    // =====================================================
    @GetMapping("/user/info")
    public ResponseEntity<?> userInfo(HttpServletRequest request) {
        String accessToken = getTokenFromCookie(request, "accessToken");

        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            Long userId = jwtTokenProvider.getUserId(accessToken);
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getUserId());
                response.put("provider", user.getProvider());
                response.put("name", user.getUsername());
                response.put("email", user.getEmail());
                response.put("role", user.getRole().name());
                return ResponseController.success(response);
            }
        }

        return ResponseController.fail("Not authenticated");
    }

    private String getTokenFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
