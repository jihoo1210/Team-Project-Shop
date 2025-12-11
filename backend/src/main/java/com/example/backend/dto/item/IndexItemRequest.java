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
    private String size;
    private Integer maxPrice;
}
