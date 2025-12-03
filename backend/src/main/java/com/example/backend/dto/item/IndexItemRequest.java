package com.example.backend.dto.item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class IndexItemRequest {
    
    private String searchField;
    private String searchTerm;
    private String majorCategory;
    private String middleCategory;
    private String subcategory;
    
}
