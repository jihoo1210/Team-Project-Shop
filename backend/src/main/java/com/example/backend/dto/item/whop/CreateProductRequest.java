package com.example.backend.dto.item.whop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateProductRequest {

    private Integer company_id;
    private String title;
    
    @Builder.Default
    private boolean collect_shipping_address = true;
    private String description;
    private PlanOptions plan_options;

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class PlanOptions {
        @Builder.Default
        private String base_currency = "kwd";
        private Integer initial_price;
        @Builder.Default
        private String plan_type = "one_time";
        @Builder.Default
        private String release_method = "buy_now";
    }

    
}
