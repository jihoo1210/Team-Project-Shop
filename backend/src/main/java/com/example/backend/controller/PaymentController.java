package com.example.backend.controller;

import com.example.backend.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Value("${toss.payments.secret-key:test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 토스페이먼츠 결제 승인 API
     * 프론트엔드에서 결제 성공 후 호출
     */
    @PostMapping("/confirm")
    public ResponseEntity<ResponseDto<Map<String, Object>>> confirmPayment(
            @RequestBody Map<String, Object> request) {

        String paymentKey = (String) request.get("paymentKey");
        String orderId = (String) request.get("orderId");
        Number amountNum = (Number) request.get("amount");

        if (paymentKey == null || orderId == null || amountNum == null) {
            return ResponseEntity.badRequest().body(
                    ResponseDto.<Map<String, Object>>builder()
                            .success(false)
                            .message("필수 파라미터가 누락되었습니다.")
                            .result(null)
                            .build()
            );
        }

        int amount = amountNum.intValue();

        try {
            // 토스페이먼츠 결제 승인 API 호출
            String url = "https://api.tosspayments.com/v1/payments/confirm";

            // Basic 인증 헤더 생성
            String credentials = secretKey + ":";
            String encodedCredentials = Base64.getEncoder()
                    .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedCredentials);

            Map<String, Object> body = new HashMap<>();
            body.put("paymentKey", paymentKey);
            body.put("orderId", orderId);
            body.put("amount", amount);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = new HashMap<>();
                result.put("paymentKey", paymentKey);
                result.put("orderId", orderId);
                result.put("amount", amount);
                result.put("orderName", response.getBody().get("orderName"));
                result.put("method", response.getBody().get("method"));
                result.put("approvedAt", response.getBody().get("approvedAt"));
                result.put("status", response.getBody().get("status"));

                log.info("결제 승인 성공: orderId={}, amount={}", orderId, amount);
                return ResponseEntity.ok(
                        ResponseDto.<Map<String, Object>>builder()
                                .success(true)
                                .result(result)
                                .build()
                );
            } else {
                log.error("결제 승인 실패: response={}", response);
                return ResponseEntity.badRequest().body(
                        ResponseDto.<Map<String, Object>>builder()
                                .success(false)
                                .message("결제 승인에 실패했습니다.")
                                .result(null)
                                .build()
                );
            }

        } catch (Exception e) {
            log.error("결제 승인 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(
                    ResponseDto.<Map<String, Object>>builder()
                            .success(false)
                            .message("결제 처리 중 오류가 발생했습니다: " + e.getMessage())
                            .result(null)
                            .build()
            );
        }
    }

    /**
     * 결제 취소 API
     */
    @PostMapping("/cancel")
    public ResponseEntity<ResponseDto<Map<String, Object>>> cancelPayment(
            @RequestBody Map<String, Object> request) {

        String paymentKey = (String) request.get("paymentKey");
        String cancelReason = (String) request.get("cancelReason");

        if (paymentKey == null) {
            return ResponseEntity.badRequest().body(
                    ResponseDto.<Map<String, Object>>builder()
                            .success(false)
                            .message("paymentKey가 필요합니다.")
                            .result(null)
                            .build()
            );
        }

        try {
            String url = "https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel";

            String credentials = secretKey + ":";
            String encodedCredentials = Base64.getEncoder()
                    .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedCredentials);

            Map<String, Object> body = new HashMap<>();
            body.put("cancelReason", cancelReason != null ? cancelReason : "고객 요청");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("결제 취소 성공: paymentKey={}", paymentKey);
                Map<String, Object> result = new HashMap<>();
                result.put("paymentKey", paymentKey);
                result.put("status", "CANCELED");
                return ResponseEntity.ok(
                        ResponseDto.<Map<String, Object>>builder()
                                .success(true)
                                .result(result)
                                .build()
                );
            } else {
                return ResponseEntity.badRequest().body(
                        ResponseDto.<Map<String, Object>>builder()
                                .success(false)
                                .message("결제 취소에 실패했습니다.")
                                .result(null)
                                .build()
                );
            }

        } catch (Exception e) {
            log.error("결제 취소 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(
                    ResponseDto.<Map<String, Object>>builder()
                            .success(false)
                            .message("결제 취소 처리 중 오류가 발생했습니다.")
                            .result(null)
                            .build()
            );
        }
    }
}
