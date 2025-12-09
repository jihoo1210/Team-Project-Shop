package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto<T> {
    private T data;
    private String message;
    private boolean success;
}
