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
    private Integer stock;
    private String status;

    public static IndexItemResponse fromEntity(Item item, boolean isFavorite, boolean isCart) {
        // 재고에 따른 판매 상태 결정
        String status = "ON_SALE";
        if (item.getStock() == null || item.getStock() <= 0) {
            status = "SOLD_OUT";
        } else if (item.getStock() < 10) {
            status = "LOW_STOCK";
        }

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
                .stock(item.getStock())
                .status(status)
                .build();
    }
}
