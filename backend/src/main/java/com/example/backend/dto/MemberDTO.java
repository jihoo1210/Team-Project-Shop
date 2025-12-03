package com.example.backend.dto;

import java.sql.Timestamp; // 날짜 시간 정밀하게 저장

import lombok.Data;

@Data
public class MemberDTO {
    // 1. 회원 기본 정보
    private int userNo;          // 회원 고유 번호 (PK)
    private String userPw;       // 비밀번호
    private String userName;     // 이름
    private String userEmail;    // 이메일
    
    // 2. 연락처 및 주소 (쇼핑몰 필수)
    private String userPhone;    // 전화번호 (010-0000-0000)
    
    // 3. 관리 정보
    private String role;         // 권한 (USER / ADMIN)
    private Timestamp regDate;   // 가입일 (DB의 DATETIME 대응)
    private String isDeleted;    // 탈퇴 여부 (N / Y)
}
