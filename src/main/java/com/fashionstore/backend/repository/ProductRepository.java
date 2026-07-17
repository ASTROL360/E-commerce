package com.fashionstore.backend.repository;

import com.fashionstore.backend.model.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @EntityGraph(attributePaths = {"category", "variants"})
    Page<Product> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "variants"})
    Page<Product> findByCategoryIdAndActiveTrue(UUID categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "variants"})
    Optional<Product> findWithCategoryAndVariantsById(UUID id);

    @EntityGraph(attributePaths = {"category", "variants"})
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) AND p.active = true")
    Page<Product> search(@Param("q") String query, Pageable pageable);
}
