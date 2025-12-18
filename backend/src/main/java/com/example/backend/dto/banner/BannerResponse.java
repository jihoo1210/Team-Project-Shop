package com.example.backend.dto.banner;

import com.example.backend.entity.banner.Banner;

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
public class BannerResponse {
    private Long id;
    private String imageUrl;
    private String title;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean isActive;

    public static BannerResponse fromEntity(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .imageUrl(banner.getImageUrl())
                .title(banner.getTitle())
                .linkUrl(banner.getLinkUrl())
                .displayOrder(banner.getDisplayOrder())
                .isActive(banner.getIsActive())
                .build();
    }
}
