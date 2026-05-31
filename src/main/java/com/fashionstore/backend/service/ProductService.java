package com.fashionstore.backend.service;

import com.fashionstore.backend.dto.request.CreateProductRequest;
import com.fashionstore.backend.dto.respond.ProductResponse;
import com.fashionstore.backend.exception.NotFoundException;
import com.fashionstore.backend.model.Category;
import com.fashionstore.backend.model.Product;
import com.fashionstore.backend.model.ProductVariant;
import com.fashionstore.backend.repository.CategoryRepository;
import com.fashionstore.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByActiveTrue(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(int page, int size, UUID categoryId, String query) {
        if (query != null && !query.isBlank()) {
            return searchProducts(query, page, size);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (categoryId != null) {
            return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toResponse);
        }

        return productRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findWithCategoryAndVariantsById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .brand(request.getBrand())
                .basePrice(request.getBasePrice())
                .coverImageUrl(request.getCoverImageUrl())
                .category(category)
                .active(true)
                .build();

        if (request.getVariants() != null) {
            request.getVariants().forEach(variantRequest -> product.getVariants().add(ProductVariant.builder()
                    .product(product)
                    .size(variantRequest.getSize())
                    .color(variantRequest.getColor())
                    .price(variantRequest.getPrice())
                    .stockQty(variantRequest.getStockQty())
                    .sku(variantRequest.getSku())
                    .build()));
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.search(query, pageable).map(this::toResponse);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, CreateProductRequest request) {
        Product product = productRepository.findWithCategoryAndVariantsById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setBasePrice(request.getBasePrice());
        product.setCoverImageUrl(request.getCoverImageUrl());
        product.setCategory(category);

        product.getVariants().clear();
        if (request.getVariants() != null) {
            request.getVariants().forEach(variantRequest -> product.getVariants().add(ProductVariant.builder()
                    .product(product)
                    .size(variantRequest.getSize())
                    .color(variantRequest.getColor())
                    .price(variantRequest.getPrice())
                    .stockQty(variantRequest.getStockQty())
                    .sku(variantRequest.getSku())
                    .build()));
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        List<ProductResponse.VariantResponse> variants = product.getVariants().stream()
                .map(v -> ProductResponse.VariantResponse.builder()
                        .id(v.getId())
                        .size(v.getSize())
                        .color(v.getColor())
                        .price(v.getPrice())
                        .stockQty(v.getStockQty())
                        .sku(v.getSku())
                        .build())
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .brand(product.getBrand())
                .basePrice(product.getBasePrice())
                .coverImageUrl(product.getCoverImageUrl())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .variants(variants)
                .build();
    }
}
