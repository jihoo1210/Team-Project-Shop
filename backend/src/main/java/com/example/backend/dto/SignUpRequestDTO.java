package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequestDTO {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자 사이여야 합니다")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String passwordConfirm;

    @NotBlank(message = "이름은 필수입니다")
    private String username;

    // 주소 (3가지)
    private String zipCode;      // 우편번호
    private String addr;         // 기본주소
    private String addrDetail;   // 상세주소

    // 전화번호
    private String phone;
}
