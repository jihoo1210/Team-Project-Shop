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
public class ShowItemResponse {

    private Long id;
    private String title;
    private String description;
    private String brand;
    private Integer price;
    private Integer discountPercent;
    private Integer realPrice;
    private String sku;
    private Integer stock;
    private String mainImageUrl;
    private List<String> imageList;
    private List<String> colorList;
    private List<String> sizeList;
    private boolean isFavorite;
    private boolean isCart;
    private Integer likeCount;

    public static ShowItemResponse fromEntity(Item item, boolean isFavorite, boolean isCart) {
        return ShowItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .brand(item.getBrand())
                .price(item.getPrice())
                .discountPercent(item.getDiscountPercent())
                .realPrice(item.getRealPrice())
                .sku(item.getSku())
                .stock(item.getStock())
                .mainImageUrl(item.getMainImageUrl())
                .imageList(item.getImageList() != null
                    ? item.getImageList().stream().map(img -> img.getImageUrl()).collect(Collectors.toList())
                    : null)
                .colorList(item.getColorList() != null
                    ? item.getColorList().stream().map(c -> c.getColor().name()).collect(Collectors.toList())
                    : null)
                .sizeList(item.getSizeList() != null
                    ? item.getSizeList().stream().map(s -> s.getSize().name()).collect(Collectors.toList())
                    : null)
                .isFavorite(isFavorite)
                .isCart(isCart)
                .likeCount(item.getLikeCount() != null ? item.getLikeCount() : 0)
                .build();
    }
}
