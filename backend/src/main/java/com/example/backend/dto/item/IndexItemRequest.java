package com.example.backend.dto.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndexItemRequest {
    private String searchField;
    private String searchTerm;
    private String majorCategory;
    private String middleCategory;
    private String subcategory;
    private String color;
    // 'size'는 Spring Pageable의 페이지 크기 파라미터와 충돌하므로 'itemSize' 사용
    private String itemSize;
    private Integer maxPrice;
}
