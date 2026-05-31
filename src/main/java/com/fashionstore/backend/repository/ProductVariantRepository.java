package com.fashionstore.backend.repository;

import com.fashionstore.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    @EntityGraph(attributePaths = "product")
    Optional<ProductVariant> findWithProductById(UUID id);
}
