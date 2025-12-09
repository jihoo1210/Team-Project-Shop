package com.example.backend.entity.user;

import java.util.List;

import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.OrderItem;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    // =====================================================
    // [종혁 코드] - 기존 필드들
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)  // [진용 수정] nullable로 변경 (소셜 로그인은 비밀번호 없음)
    private String password;

    @Column(nullable = false)
    private String username;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(length = 255)
    private String addr;

    @Column(name = "addr_detail", length = 255)
    private String addrDetail;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.USER;

    // =====================================================
    // [진용 추가] - 소셜 로그인용 필드
    // =====================================================

    @Column(length = 20)
    private String provider;  // "google", "naver", "local"

    @Column(name = "provider_id")
    private String providerId;  // 소셜 플랫폼의 고유 ID

    // =====================================================
    // [종혁 코드] - 기존 빌더 (수정됨)
    // =====================================================

    @Builder
    public User(String email, String password, String username,
                String zipCode, String addr, String addrDetail, String phone, Role role,
                String provider, String providerId) {  // [진용 추가] 파라미터 추가
        this.email = email;
        this.password = password;
        this.username = username;
        this.zipCode = zipCode;
        this.addr = addr;
        this.addrDetail = addrDetail;
        this.phone = phone;
        this.role = role != null ? role : Role.USER;
        // [진용 추가]
        this.provider = provider;
        this.providerId = providerId;
    }

    // =====================================================
    // [종혁 코드] - 기존 메서드들
    // =====================================================

    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public void updateInfo(String username, String zipCode, String addr,
                           String addrDetail, String phone) {
        this.username = username;
        this.zipCode = zipCode;
        this.addr = addr;
        this.addrDetail = addrDetail;
        this.phone = phone;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

}
