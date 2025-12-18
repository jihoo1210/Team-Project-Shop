package com.example.backend.dto.order;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class OrderListResponse {
    Long orderId;
    String title;          // 대표 상품명 (첫 번째 상품명 + 외 n개)
    String mainImgUrl;     // 대표 이미지
    Integer totalPrice;
    String status;
    LocalDateTime createdAt;
}
