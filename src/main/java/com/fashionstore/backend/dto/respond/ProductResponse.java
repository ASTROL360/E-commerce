package com.fashionstore.backend.dto.respond;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.*;

@Data @Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal basePrice;
    private String coverImageUrl;
    private UUID categoryId;
    private String categoryName;
    private List<VariantResponse> variants;

    @Data @Builder
    public static class VariantResponse {
        private UUID id;
        private String size;
        private String color;
        private BigDecimal price;
        private int stockQty;
        private String sku;
    }
}
