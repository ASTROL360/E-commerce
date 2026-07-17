package com.fashionstore.backend.repository;

import com.fashionstore.backend.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.*;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product"})
    List<Order> findByUserIdOrderByOrderedAtDesc(UUID userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.variant v LEFT JOIN FETCH v.product ORDER BY o.orderedAt DESC")
    List<Order> findAllWithItems();

    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product"})
    Optional<Order> findWithItemsById(UUID id);
}
