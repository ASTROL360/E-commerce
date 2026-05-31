package com.fashionstore.backend.dto.respond;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CartItemResponse {
    private UUID id;
    private UUID variantId;
    private UUID productId;
    private String productName;
    private String coverImageUrl;
    private String size;
    private String color;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
}
