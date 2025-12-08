package com.example.backend.controller.utility;

import org.springframework.http.ResponseEntity;

import com.example.backend.dto.ResponseDto;

public class ResponseController {

    public static <T> ResponseEntity<ResponseDto<T>> success(T data) {
        ResponseDto<T> responseDto = ResponseDto.<T>builder()
                .data(data)
                .success(true)
                .build();
        return ResponseEntity.ok(responseDto);
    }

    public static ResponseEntity<ResponseDto> error(Exception e) {
        ResponseDto responseDto = ResponseDto.builder()
                .data(null)
                .message(e.getMessage())
                .success(false)
                .build();
        return ResponseEntity.badRequest().body(responseDto);
    }
}
