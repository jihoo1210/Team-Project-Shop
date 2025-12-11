package com.example.backend.controller;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignUpRequestDTO;
import com.example.backend.dto.TokenResponseDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.access-token-validity:3600000}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity:604800000}")
    private long refreshTokenValidity;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDTO request) {
        try {
            UserResponseDTO user = authService.signUp(request);
            return ResponseController.success(user);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 로그인 (JWT 토큰을 쿠키로 발급)
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request,
                                   HttpServletResponse response) {
        try {
            TokenResponseDTO token = authService.login(request);

            // Access Token 쿠키 설정
            Cookie accessTokenCookie = new Cookie("accessToken", token.getAccessToken());
            accessTokenCookie.setHttpOnly(true);  // JavaScript 접근 불가 (XSS 방지)
            accessTokenCookie.setSecure(false);   // 개발 환경에서는 false, 프로덕션에서는 true
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge((int) (accessTokenValidity / 1000)); // 초 단위
            response.addCookie(accessTokenCookie);

            // Refresh Token 쿠키 설정
            Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(false);
            refreshTokenCookie.setPath("/api/auth/refresh");  // refresh 엔드포인트에서만 전송
            refreshTokenCookie.setMaxAge((int) (refreshTokenValidity / 1000));
            response.addCookie(refreshTokenCookie);

            // 응답 본문에는 사용자 정보만 반환 (토큰은 쿠키로)
            return ResponseController.success(token.getUser());
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 토큰 갱신 (쿠키에서 Refresh Token 읽기)
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 쿠키에서 Refresh Token 추출
            String refreshToken = extractTokenFromCookie(request, "refreshToken");
            if (refreshToken == null) {
                return ResponseController.fail("Refresh Token이 없습니다.");
            }

            TokenResponseDTO token = authService.refresh(refreshToken);

            // 새 Access Token 쿠키 설정
            Cookie accessTokenCookie = new Cookie("accessToken", token.getAccessToken());
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(false);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge((int) (accessTokenValidity / 1000));
            response.addCookie(accessTokenCookie);

            return ResponseController.success(token.getUser());
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 로그아웃 (쿠키 삭제)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Access Token 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        response.addCookie(accessTokenCookie);

        // Refresh Token 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/api/auth/refresh");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);

        return ResponseController.success("로그아웃 성공");
    }

    // 이메일 중복 체크
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicate = authService.checkEmailDuplicate(email);
        return ResponseController.success(isDuplicate);
    }

    // 현재 로그인 사용자 정보
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            return ResponseController.fail("로그인이 필요합니다.");
        }

        try {
            UserResponseDTO user = authService.getCurrentUser(userId);
            return ResponseController.success(user);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 회원정보 수정
    @PutMapping("/me")
    public ResponseEntity<?> updateUser(@RequestBody SignUpRequestDTO request,
                                         HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            return ResponseController.fail("로그인이 필요합니다.");
        }

        try {
            UserResponseDTO user = authService.updateUser(userId, request);
            return ResponseController.success(user);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            return ResponseController.fail("로그인이 필요합니다.");
        }

        try {
            authService.updatePassword(userId, currentPassword, newPassword);
            return ResponseController.success("비밀번호가 변경되었습니다.");
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }

    // 쿠키에서 토큰 추출 헬퍼 메서드
    private String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
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
