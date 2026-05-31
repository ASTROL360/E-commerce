package com.fashionstore.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CartItemRequest {
    @NotNull
    private UUID variantId;

    @Min(1)
    private int quantity = 1;
}
