package com.example.backend.dto.review;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class IndexReviewResponse {
    String content;
    Integer score;
    LocalDateTime created_at;
    LocalDateTime updated_at;
}
