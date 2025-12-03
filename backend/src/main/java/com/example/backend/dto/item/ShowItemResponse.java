package com.example.backend.dto.item;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.enums.ColorEnum;
import com.example.backend.entity.item.enums.SizeEnum;
import lombok.Builder;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ShowItemResponse {
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

    public static ShowItemResponse fromEntity(Item item, boolean isSavedInLikes, boolean isSavedInCart) {
        return ShowItemResponse.builder()
                .status(true) // 예시: 실제 status 로직에 맞게 수정
                .discountPercent(item.getDiscountPercent())
                .colorList(item.getColorList().stream().map(color -> color.getColor()).toList())
                .likeCount(item.getFavoriteItemList().size())
                .savedInLikes(isSavedInLikes)
                .price(item.getPrice())
                .scoreAverage(item.getReviewList().stream()
                        .mapToDouble(review -> review.getScore())
                        .average()
                        .orElse(0.0))
                .savedInCart(isSavedInCart)
                .mainImageUrl(item.getMainImageUrl())
                .brand(item.getBrand())
                .title(item.getTitle())
                .reviewCount(item.getReviewList().size())
                .sku(item.getSku())
                .sizeList(item.getSizeList().size() > 0 ?
                        item.getSizeList().stream().map(size -> size.getSize()).toList() :
                        new ArrayList<>())
                .build();
    }
}
