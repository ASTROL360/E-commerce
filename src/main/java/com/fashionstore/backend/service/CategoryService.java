package com.fashionstore.backend.service;

import com.fashionstore.backend.dto.request.CategoryRequest;
import com.fashionstore.backend.dto.respond.CategoryResponse;
import com.fashionstore.backend.exception.ConflictException;
import com.fashionstore.backend.exception.NotFoundException;
import com.fashionstore.backend.model.Category;
import com.fashionstore.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Category slug already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .imageUrl(request.getImageUrl())
                .build();

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        categoryRepository.findBySlug(request.getSlug())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ConflictException("Category slug already exists");
                });

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setImageUrl(request.getImageUrl());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .imageUrl(category.getImageUrl())
                .build();
    }
}
