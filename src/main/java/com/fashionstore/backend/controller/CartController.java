package com.fashionstore.backend.controller;

import com.fashionstore.backend.dto.request.CartItemRequest;
import com.fashionstore.backend.dto.respond.CartItemResponse;
import com.fashionstore.backend.service.CartService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItemResponse> getCart(Principal principal) {
        return cartService.getCart(principal.getName());
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addItem(
            Principal principal,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.status(201).body(cartService.addItem(principal.getName(), request));
    }

    @PutMapping("/items/{id}")
    public CartItemResponse updateItem(
            Principal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateQuantity(principal.getName(), id, request.getQuantity());
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeItem(Principal principal, @PathVariable UUID id) {
        cartService.removeItem(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class UpdateCartItemRequest {
        @Min(1)
        private int quantity;
    }
}
