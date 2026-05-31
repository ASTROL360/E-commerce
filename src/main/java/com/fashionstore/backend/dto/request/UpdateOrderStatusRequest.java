package com.fashionstore.backend.dto.request;

import com.fashionstore.backend.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull
    private Order.OrderStatus status;
}
