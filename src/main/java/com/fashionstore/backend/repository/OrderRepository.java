package com.fashionstore.backend.repository;

import com.fashionstore.backend.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product"})
    List<Order> findByUserIdOrderByOrderedAtDesc(UUID userId);

    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product"})
    Optional<Order> findWithItemsById(UUID id);
}
