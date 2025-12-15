package com.example.backend.dto.item;

import java.util.List;
import java.util.stream.Collectors;

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
    private Integer cartCount;
    private Integer reviewCount;
    private Integer reviewAverage;
    private Integer stock;
    private String status;
    private List<String> colors;
    private List<String> sizes;

    public static IndexItemResponse fromEntity(Item item, boolean isFavorite, boolean isCart) {
        // 재고에 따른 판매 상태 결정
        String status = "ON_SALE";
        if (item.getStock() == null || item.getStock() <= 0) {
            status = "SOLD_OUT";
        } else if (item.getStock() < 10) {
            status = "LOW_STOCK";
        }

        // 색상 목록 추출
        List<String> colors = item.getColorList() != null
            ? item.getColorList().stream()
                .map(c -> c.getColor().name())
                .collect(Collectors.toList())
            : List.of();

        // 사이즈 목록 추출
        List<String> sizes = item.getSizeList() != null
            ? item.getSizeList().stream()
                .map(s -> s.getSize().name())
                .collect(Collectors.toList())
            : List.of();

        // 장바구니에 담긴 수
        int cartCount = item.getCartItemList() != null ? item.getCartItemList().size() : 0;

        // 리뷰 수
        int reviewCount = item.getReviewList() != null ? item.getReviewList().size() : 0;

        // 리뷰 평균 점수 (1~5점, 정수 반올림)
        int reviewAverage = 0;
        if (item.getReviewList() != null && !item.getReviewList().isEmpty()) {
            double avg = item.getReviewList().stream()
                .filter(r -> r.getScore() != null)
                .mapToInt(r -> r.getScore())
                .average()
                .orElse(0.0);
            reviewAverage = (int) Math.round(avg);
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
                .likeCount(item.getLikeCount() != null ? item.getLikeCount() : 0)
                .cartCount(cartCount)
                .reviewCount(reviewCount)
                .reviewAverage(reviewAverage)
                .stock(item.getStock())
                .status(status)
                .colors(colors)
                .sizes(sizes)
                .build();
    }
}
