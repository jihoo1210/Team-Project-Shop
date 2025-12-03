package com.example.backend.entity.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email; // 로그인 ID 역할

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String username; // 실명

    // 주소 (3가지로 분리)
    @Column(name = "zip_code", length = 10)
    private String zipCode; // 우편번호

    @Column(length = 255)
    private String addr; // 기본주소

    @Column(name = "addr_detail", length = 255)
    private String addrDetail; // 상세주소

    // 전화번호
    @Column(name = "phone", length = 20)
    private String phone;

    // 역할 (USER, ADMIN)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.USER;  // 기본값: USER

    @Builder
    public User(String email, String password, String username, 
                String zipCode, String addr, String addrDetail, String phone, Role role) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.zipCode = zipCode;
        this.addr = addr;
        this.addrDetail = addrDetail;
        this.phone = phone;
        this.role = role != null ? role : Role.USER;
    }

    // 관리자 여부 확인
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    // 회원정보 수정
    public void updateInfo(String username, String zipCode, String addr, 
                           String addrDetail, String phone) {
        this.username = username;
        this.zipCode = zipCode;
        this.addr = addr;
        this.addrDetail = addrDetail;
        this.phone = phone;
    }

    // 비밀번호 변경
    public void updatePassword(String password) {
        this.password = password;
    }
}

