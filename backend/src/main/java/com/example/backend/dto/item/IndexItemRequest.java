package com.example.backend.dto.item;

import java.util.List;

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
    // 다수의 색상 필터링 지원 (예: ?colors=RED&colors=BLUE)
    private List<String> colors;
    // 다수의 사이즈 필터링 지원 (예: ?itemSizes=S&itemSizes=M)
    // 'size'는 Spring Pageable의 페이지 크기 파라미터와 충돌하므로 'itemSizes' 사용
    private List<String> itemSizes;
    private Integer maxPrice;
}
