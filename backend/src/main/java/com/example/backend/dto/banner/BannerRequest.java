package com.example.backend.dto.banner;

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
public class BannerRequest {
    private String imageUrl;
    private String title;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean isActive;
}
