package com.fashionstore.backend.service;

import com.fashionstore.backend.dto.request.CheckoutRequest;
import com.fashionstore.backend.dto.respond.OrderResponse;
import com.fashionstore.backend.exception.BadRequestException;
import com.fashionstore.backend.exception.NotFoundException;
import com.fashionstore.backend.model.CartItem;
import com.fashionstore.backend.model.Order;
import com.fashionstore.backend.model.OrderItem;
import com.fashionstore.backend.model.ProductVariant;
import com.fashionstore.backend.model.User;
import com.fashionstore.backend.repository.CartItemRepository;
import com.fashionstore.backend.repository.OrderRepository;
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
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserIdOrderByOrderedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findWithItemsById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new NotFoundException("Order not found");
        }

        return toResponse(order);
    }

    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {
        User user = getUser(email);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getVariant();
            if (cartItem.getQuantity() > variant.getStockQty()) {
                throw new BadRequestException("Insufficient stock for " + variant.getProduct().getName());
            }

            variant.setStockQty(variant.getStockQty() - cartItem.getQuantity());
            productVariantRepository.save(variant);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(variant.getPrice())
                    .build();

            order.getItems().add(item);
            total = total.add(variant.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());
        return toResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateStatus(UUID orderId, Order.OrderStatus status) {
        Order order = orderRepository.findWithItemsById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .orderedAt(order.getOrderedAt())
                .items(order.getItems().stream().map(this::toItemResponse).toList())
                .build();
    }

    private OrderResponse.ItemResponse toItemResponse(OrderItem item) {
        ProductVariant variant = item.getVariant();
        BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderResponse.ItemResponse.builder()
                .variantId(variant.getId())
                .productName(variant.getProduct().getName())
                .size(variant.getSize())
                .color(variant.getColor())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(lineTotal)
                .build();
    }
}
