package com.example.backend.dto;

import java.util.List;

public record AiProxyRequest(
        String purpose,
        List<ChatMessage> messages
) {
    public record ChatMessage(String role, String content) {
    }
}
