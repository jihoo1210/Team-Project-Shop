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
import com.example.backend.entity.item.utility.OrderItemList;
import com.example.backend.entity.item.utility.ViewedItem;
import com.example.backend.entity.review.Review;
import com.example.backend.entity.utility.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviewList;
    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItemList;
    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteItem> favoriteItemList;
    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemList> orderItemList;
    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ViewedItem> viewedItemList;

    public void update(ItemResistraionRequest dto) {
        if(dto.getTitle() != null && !dto.getTitle().equals(this.title)) {
            this.title = dto.getTitle();
        }
        if(dto.getPrice() != this.price) {
            this.price = dto.getPrice();
        }
        if(dto.getDiscountPercent() != this.discountPercent) {
            this.discountPercent = dto.getDiscountPercent();
        }
        if(dto.getSku() != null && !dto.getSku().equals(this.sku)) {
            this.sku = dto.getSku();
        }
        if(dto.getBrand() != null && !dto.getBrand().equals(this.brand)) {
            this.brand = dto.getBrand();
        }
        if(dto.getDescription() != null && !dto.getDescription().equals(this.description)) {
            this.description = dto.getDescription();
        }
        if(dto.getMainImageUrl() != null && !dto.getMainImageUrl().equals(this.mainImageUrl)) {
            this.mainImageUrl = dto.getMainImageUrl();
        }
        if(dto.getStock() != null) {
            this.stock = dto.getStock();
        }
        if(dto.getMajorCategory() != null) {
            this.majorCategory = MajorCategoryEnum.valueOf(dto.getMajorCategory());
        }
        if(dto.getMiddleCategory() != null) {
            this.middleCategory = MiddleCategoryEnum.valueOf(dto.getMiddleCategory());
        }
        if(dto.getSubcategory() != null) {
            this.subcategory = SubcategoryEnum.valueOf(dto.getSubcategory());
        }
    }

    public int getRealPrice() {
        return this.price - this.price * discountPercent / 100;
    }
}

// 필수값 누락 방지 위해 Builder에 필수값 체크 필요
// 연관관계 매핑(@OneToMany, @ManyToOne 등) 올바른지 확인
// CascadeType, orphanRemoval 등 설정으로 연관 엔티티 자동 삭제 가능
// equals, hashCode, toString 오버라이드 시 순환 참조 주의