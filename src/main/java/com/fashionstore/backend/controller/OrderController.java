package com.fashionstore.backend.controller;

import com.fashionstore.backend.dto.request.CheckoutRequest;
import com.fashionstore.backend.dto.request.UpdateOrderStatusRequest;
import com.fashionstore.backend.dto.respond.OrderResponse;
import com.fashionstore.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> getOrders(Principal principal) {
        return orderService.getOrders(principal.getName());
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(Principal principal, @PathVariable UUID id) {
        return orderService.getOrder(principal.getName(), id);
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            Principal principal,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(201).body(orderService.checkout(principal.getName(), request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateStatus(id, request.getStatus());
    }
}
