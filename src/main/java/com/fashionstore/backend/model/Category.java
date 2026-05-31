package com.fashionstore.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;           // e.g. "Men's Shirts"

    @Column(nullable = false, unique = true)
    private String slug;           // e.g. "mens-shirts"

    private String imageUrl;
}