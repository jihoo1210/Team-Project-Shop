package com.example.backend.service;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignUpRequestDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.user.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    // 로그인
    public UserResponseDTO login(LoginRequestDTO request, HttpSession session) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 세션에 사용자 정보 저장
        session.setAttribute("loginUserId", user.getUserId());
        session.setAttribute("loginUserEmail", user.getEmail());
        session.setAttribute("loginUserName", user.getUsername());
        session.setAttribute("loginUserRole", user.getRole().name()); // 역할 추가

        return UserResponseDTO.from(user);
    }

    // 로그아웃
    public void logout(HttpSession session) {
        session.invalidate();
    }

    // 이메일 중복 체크
    public boolean checkEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    // 현재 로그인한 사용자 정보 조회
    public UserResponseDTO getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUserId");
        if (userId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

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
