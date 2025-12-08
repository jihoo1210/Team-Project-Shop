package com.example.backend.entity.item;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Bag;

import com.example.backend.dto.admin.ItemResistraionRequest;
import com.example.backend.entity.item.details.Color;
import com.example.backend.entity.item.details.ItemImage;
import com.example.backend.entity.item.details.Size;
import com.example.backend.entity.item.enums.MajorCategoryEnum;
import com.example.backend.entity.item.enums.MiddleCategoryEnum;
import com.example.backend.entity.item.enums.SubcategoryEnum;
import com.example.backend.entity.item.utility.CartItem;
import com.example.backend.entity.item.utility.FavoriteItem;
import com.example.backend.entity.item.utility.OrderItem;
import com.example.backend.entity.item.utility.ViewedItem;
import com.example.backend.entity.review.Review;
import com.example.backend.entity.utility.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
public class Item extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;
    @Column
    private String description;
    @Column
    private Integer price;
    @Column
    private Integer discountPercent;
    @Column
    private String brand;
    @Column
    private Integer stock;
    @Column
    private String sku;
    @Builder.Default
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> imageList = new ArrayList<>();
    @Column
    private String mainImageUrl;

    @Enumerated(EnumType.STRING)
    private MajorCategoryEnum majorCategory;
    @Enumerated(EnumType.STRING)
    private MiddleCategoryEnum middleCategory;
    @Enumerated(EnumType.STRING)
    private SubcategoryEnum subcategory;

    @Builder.Default
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Color> colorList = new ArrayList<>();
    @Builder.Default
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Size> sizeList = new ArrayList<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviewList;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItemList;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteItem> favoriteItemList;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItemList;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ViewedItem> viewedItemList;

    public void update(ItemResistraionRequest dto) {
        if(!this.title.equals(dto.getTitle()) && dto.getTitle() != null) {
            this.title = dto.getTitle();
        }
        if(!this.price.equals(dto.getPrice())) {
            this.price = dto.getPrice();
        }
        if(!this.discountPercent.equals(dto.getDiscountPercent())) {
            this.discountPercent = dto.getDiscountPercent();
        }
        if(!this.sku.equals(dto.getSku()) && dto.getSku() != null) {
            this.sku = dto.getSku();
        }
        if(!this.brand.equals(dto.getBrand()) && dto.getBrand() != null) {
            this.brand = dto.getBrand();
        }
        if(!this.description.equals(dto.getDescription()) && dto.getDescription() != null) {
            this.description = dto.getDescription();
        }
        if(!this.mainImageUrl.equals(dto.getMainImageUrl()) && dto.getMainImageUrl() != null) {
            this.mainImageUrl = dto.getMainImageUrl();
        }
    }
}

// 필수값 누락 방지 위해 Builder에 필수값 체크 필요
// 연관관계 매핑(@OneToMany, @ManyToOne 등) 올바른지 확인
// CascadeType, orphanRemoval 등 설정으로 연관 엔티티 자동 삭제 가능
// equals, hashCode, toString 오버라이드 시 순환 참조 주의