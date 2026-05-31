package com.fashionstore.backend.repository;

import com.fashionstore.backend.model.CartItem; // import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    @EntityGraph(attributePaths = {"variant", "variant.product"})
    List<CartItem> findByUserId(UUID userId);

    @EntityGraph(attributePaths = {"variant", "variant.product"})
    Optional<CartItem> findWithVariantById(UUID id);

    Optional<CartItem> findByUserIdAndVariantId(UUID userId, UUID variantId);

    void deleteByUserId(UUID userId);
}
