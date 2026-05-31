package com.fashionstore.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;
    private String brand;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal basePrice;

    @NotNull
    private UUID categoryId;

    private String coverImageUrl;

    private List<VariantRequest> variants = new ArrayList<>();

    @Data
    public static class VariantRequest {
        @NotBlank
        private String size;

        @NotBlank
        private String color;

        @NotNull
        @DecimalMin("0.01")
        private BigDecimal price;

        @Min(0)
        private int stockQty;

        private String sku;
    }
}
