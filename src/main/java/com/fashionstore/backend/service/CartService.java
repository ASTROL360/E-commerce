package com.fashionstore.backend.service;

import com.fashionstore.backend.dto.request.CartItemRequest;
import com.fashionstore.backend.dto.respond.CartItemResponse;
import com.fashionstore.backend.exception.BadRequestException;
import com.fashionstore.backend.exception.NotFoundException;
import com.fashionstore.backend.model.CartItem;
import com.fashionstore.backend.model.ProductVariant;
import com.fashionstore.backend.model.User;
import com.fashionstore.backend.repository.CartItemRepository;
import com.fashionstore.backend.repository.ProductVariantRepository;
import com.fashionstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String email) {
        User user = getUser(email);
        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CartItemResponse addItem(String email, CartItemRequest request) {
        User user = getUser(email);
        ProductVariant variant = productVariantRepository.findWithProductById(request.getVariantId())
                .orElseThrow(() -> new NotFoundException("Product variant not found"));

        if (request.getQuantity() > variant.getStockQty()) {
            throw new BadRequestException("Requested quantity is not available");
        }

        CartItem item = cartItemRepository.findByUserIdAndVariantId(user.getId(), variant.getId())
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .variant(variant)
                        .quantity(0)
                        .build());

        int newQuantity = item.getQuantity() + request.getQuantity();
        if (newQuantity > variant.getStockQty()) {
            throw new BadRequestException("Requested quantity is not available");
        }

        item.setQuantity(newQuantity);
        return toResponse(cartItemRepository.save(item));
    }

    @Transactional
    public CartItemResponse updateQuantity(String email, UUID cartItemId, int quantity) {
        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        User user = getUser(email);
        CartItem item = cartItemRepository.findWithVariantById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new NotFoundException("Cart item not found");
        }

        if (quantity > item.getVariant().getStockQty()) {
            throw new BadRequestException("Requested quantity is not available");
        }

        item.setQuantity(quantity);
        return toResponse(cartItemRepository.save(item));
    }

    @Transactional
    public void removeItem(String email, UUID cartItemId) {
        User user = getUser(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new NotFoundException("Cart item not found");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String email) {
        cartItemRepository.deleteByUserId(getUser(email).getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private CartItemResponse toResponse(CartItem item) {
        ProductVariant variant = item.getVariant();
        BigDecimal unitPrice = variant.getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .variantId(variant.getId())
                .productId(variant.getProduct().getId())
                .productName(variant.getProduct().getName())
                .coverImageUrl(variant.getProduct().getCoverImageUrl())
                .size(variant.getSize())
                .color(variant.getColor())
                .unitPrice(unitPrice)
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .build();
    }
}
