package com.example.backend.dto.admin;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ItemResistraionRequest {
    private String title; // 필수값 여부 확인 필요
    private int price; // 0 이하 값 입력 방지 검증 필요
    private int discountPercent; // 0~100 범위 검증 필요
    private String sku; // 중복 방지 검증 필요
    private List<String> colorList; // null 체크 및 기본값 처리 필요
    private List<String> sizeList; // null 체크 및 기본값 처리 필요
    private List<String> imageList; // null 체크 및 기본값 처리 필요
    private String brand; // 필수값 여부 확인 필요ㅆ
    private String description; // 길이 제한 검증 필요
    private String mainImageUrl; // URL 형식 검증 필요

    // Getters and Setters
    // 생성자 추가 시 불변 객체로 만들 수 있음
}
