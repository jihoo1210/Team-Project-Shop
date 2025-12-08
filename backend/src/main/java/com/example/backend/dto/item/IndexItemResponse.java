package com.example.backend.dto.item;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.SizeEnum;
import com.example.backend.entity.review.Review;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class IndexItemResponse {
    private Boolean status;
    private Integer discountPercent;
    @Builder.Default
    private List<ColorEnum> colorList = new ArrayList<>();
    private Integer likeCount;
    private Boolean savedInLikes;
    private Integer price;
    private Double scoreAverage;
    private Boolean savedInCart;
    private String mainImageUrl;
    private String brand;
    private String title;
    private Integer reviewCount;
    private String sku;
    @Builder.Default
    private List<SizeEnum> sizeList = new ArrayList<>();
    
    
    public static IndexItemResponse fromEntity(Item item, boolean isSavedInLikes, boolean isSavedInCart) {
        IndexItemResponse response = IndexItemResponse.builder()
                .status(true) // Assuming status is always true for this example
                .discountPercent(item.getDiscountPercent())
                .price(item.getPrice())
                .mainImageUrl(item.getMainImageUrl())
                .brand(item.getBrand())
                .title(item.getTitle())
                .sku(item.getSku())
                .build();
        response.getColorList().addAll(item.getColorList().stream().map(color -> color.getColor()).toList());
        response.getSizeList().addAll(item.getSizeList().stream().map(size -> size.getSize()).toList());
        response.setLikeCount(item.getFavoriteItemList().size());
        response.setReviewCount(item.getReviewList().size());
        Double average = item.getReviewList().stream()
                .mapToDouble(Review::getScore)
                .average()
                .orElse(0.0);
        response.setScoreAverage(average);
        return response;
    }
}
