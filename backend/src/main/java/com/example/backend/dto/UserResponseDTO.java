package com.example.backend.dto;

import com.example.backend.entity.user.User;
import lombok.Data;

@Data
public class UserResponseDTO {

    private Long userId;
    private String email;
    private String username;
    private String zipCode;
    private String addr;
    private String addrDetail;
    private String phone;
    private String role; // 역할 (USER, ADMIN)

    // Entity -> DTO 변환
    public static UserResponseDTO from(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setZipCode(user.getZipCode());
        dto.setAddr(user.getAddr());
        dto.setAddrDetail(user.getAddrDetail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name()); // 역할 추가
        return dto;
    }
}
