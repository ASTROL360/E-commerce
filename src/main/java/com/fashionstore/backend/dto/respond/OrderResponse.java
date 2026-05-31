package com.fashionstore.backend.dto.respond;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderResponse {
    private UUID id;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private LocalDateTime orderedAt;
    private List<ItemResponse> items;

    @Data
    @Builder
    public static class ItemResponse {
        private UUID variantId;
        private String productName;
        private String size;
        private String color;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }
}
