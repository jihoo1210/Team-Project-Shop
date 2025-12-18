package com.example.backend.dto.admin;

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
public class ItemResistraionRequest {
    private String title;
    private int price;
    private int discountPercent;
    private String sku;
    private String brand;
    private String description;
    private List<String> colorList;
    private List<String> sizeList;
    private String mainImageUrl;
    private List<String> imageList;
    private Integer stock;
    private String majorCategory;
    private String middleCategory;
    private String subcategory;
}
