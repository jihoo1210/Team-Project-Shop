package com.example.backend.service;

import com.example.backend.dto.AiProxyRequest;
import com.example.backend.dto.AiProxyResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiProxyService {

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final Logger log = LoggerFactory.getLogger(AiProxyService.class);
    private static final String FALLBACK_CONTENT =
            "죄송합니다, 현재 자동 응답이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public AiProxyService(
            @Value("${openai.api-key:}") String apiKey,
            RestTemplate restTemplate,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public AiProxyResponse send(AiProxyRequest request) {
        if (request == null || request.messages() == null || request.messages().isEmpty()) {
            return new AiProxyResponse(FALLBACK_CONTENT + " (요청 메시지 없음)");
        }
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("OpenAI API 키가 설정되지 않았습니다. 환경변수 OPENAI_API_KEY를 확인하세요.");
            return new AiProxyResponse(FALLBACK_CONTENT + " (API 키 미설정)");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("temperature", "support".equalsIgnoreCase(request.purpose()) ? 0.3 : 0.6);
            body.put("messages", request.messages().stream().map(m -> Map.of(
                    "role", m.role(),
                    "content", m.content()
            )).toList());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);

            return new AiProxyResponse(extractContent(response.getBody()));
        } catch (Exception e) {
            log.error("OpenAI 호출 중 오류 발생", e);
            return new AiProxyResponse(FALLBACK_CONTENT);
        }
    }

    private String extractContent(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode content = root.path("choices").get(0).path("message").path("content");
            if (!content.isMissingNode()) {
                return content.asText();
            }
        } catch (Exception e) {
            throw new IllegalStateException("OpenAI 응답을 처리하는 중 오류가 발생했습니다.", e);
        }
        throw new IllegalStateException("OpenAI 응답에 유효한 content가 없습니다.");
    }
}
