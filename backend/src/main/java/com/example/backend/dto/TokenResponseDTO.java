package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserResponseDTO user;

    public static TokenResponseDTO of(String accessToken, String refreshToken, UserResponseDTO user) {
        return TokenResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(user)
                .build();
    }
}

