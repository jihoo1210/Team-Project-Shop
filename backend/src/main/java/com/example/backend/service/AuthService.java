package com.example.backend.service;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignUpRequestDTO;
import com.example.backend.dto.TokenResponseDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Transactional
    public UserResponseDTO signUp(SignUpRequestDTO request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 확인 일치 체크
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // User 엔티티 생성 (기본 역할: USER)
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .username(request.getUsername())
                .zipCode(request.getZipCode())
                .addr(request.getAddr())
                .addrDetail(request.getAddrDetail())
                .phone(request.getPhone())
                .role(com.example.backend.entity.user.Role.USER)
                .build();

        userRepository.save(user);

        return UserResponseDTO.from(user);
    }

    // 로그인 (JWT 토큰 발급)
    public TokenResponseDTO login(LoginRequestDTO request) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(
                user.getUserId(), 
                user.getEmail(), 
                user.getRole().name()
        );
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        return TokenResponseDTO.of(accessToken, refreshToken, UserResponseDTO.from(user));
    }

    // Refresh Token으로 Access Token 재발급
    public TokenResponseDTO refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 새 Access Token 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name()
        );

        return TokenResponseDTO.of(newAccessToken, refreshToken, UserResponseDTO.from(user));
    }

    // 이메일 중복 체크
    public boolean checkEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    // 현재 로그인한 사용자 정보 조회 (토큰에서 userId 추출)
    public UserResponseDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return UserResponseDTO.from(user);
    }

    // 회원정보 수정
    @Transactional
    public UserResponseDTO updateUser(Long userId, SignUpRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.updateInfo(
                request.getUsername(),
                request.getZipCode(),
                request.getAddr(),
                request.getAddrDetail(),
                request.getPhone()
        );

        return UserResponseDTO.from(user);
    }

    // 비밀번호 변경
    @Transactional
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }

        // 새 비밀번호 암호화 후 저장
        user.updatePassword(passwordEncoder.encode(newPassword));
    }
}
