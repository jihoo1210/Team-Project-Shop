package com.example.backend.dto.item;

import java.util.Random;

import com.example.backend.entity.item.Item;

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
public class IndexItemResponse {
    private static final Random random = new Random();

    private Long id;
    private String title;
    private String brand;
    private Integer price;
    private Integer discountPercent;
    private Integer realPrice;
    private String mainImageUrl;
    private boolean isFavorite;
    private boolean isCart;
    private Integer likeCount;

    public static IndexItemResponse fromEntity(Item item, boolean isFavorite, boolean isCart) {
        return IndexItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .brand(item.getBrand())
                .price(item.getPrice())
                .discountPercent(item.getDiscountPercent())
                .realPrice(item.getRealPrice())
                .mainImageUrl(item.getMainImageUrl())
                .isFavorite(isFavorite)
                .isCart(isCart)
                .likeCount(random.nextInt(500) + 10)
                .build();
    }
}
