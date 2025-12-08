package com.example.backend.dto.review;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class ReviewCreateRequest {

    String content;
    Integer score;
    
}
