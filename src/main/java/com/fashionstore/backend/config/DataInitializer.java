package com.fashionstore.backend.config;

import com.fashionstore.backend.model.*;
import com.fashionstore.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Value("${app.admin.name:Store Admin}")
    private String adminName;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        seedCategoriesAndProducts();
    }

    private void seedAdmin() {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        userRepository.save(User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(User.Role.ADMIN)
                .build());
    }

    private void seedCategoriesAndProducts() {
        if (productRepository.count() > 0) return;

        Category mens = categoryRepository.save(Category.builder()
                .name("Men's Clothing").slug("mens-clothing")
                .imageUrl("https://images.unsplash.com/photo-1617137968427-859a5e214c71?w=400")
                .build());

        Category womens = categoryRepository.save(Category.builder()
                .name("Women's Clothing").slug("womens-clothing")
                .imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400")
                .build());

        Category shoesCat = categoryRepository.save(Category.builder()
                .name("Shoes").slug("shoes")
                .imageUrl("https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400")
                .build());

        Category accessories = categoryRepository.save(Category.builder()
                .name("Accessories").slug("accessories")
                .imageUrl("https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400")
                .build());

        createProduct("Classic Oxford Shirt", mens, "Tailor & Co",
                "Timeless button-down Oxford shirt in premium cotton. Perfect for both formal and casual occasions.",
                "49.99", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
                variant("S", "White", "45.99", 20),
                variant("M", "White", "45.99", 30),
                variant("L", "White", "45.99", 25),
                variant("XL", "White", "45.99", 15),
                variant("S", "Light Blue", "49.99", 20),
                variant("M", "Light Blue", "49.99", 30),
                variant("L", "Light Blue", "49.99", 25),
                variant("XL", "Light Blue", "49.99", 15),
                variant("M", "Black", "54.99", 20),
                variant("L", "Black", "54.99", 15));

        createProduct("Slim Fit Chinos", mens, "Urban Tailor",
                "Modern slim-fit chinos in stretch cotton twill. Comfortable and versatile for any wardrobe.",
                "59.99", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
                variant("30", "Khaki", "59.99", 25),
                variant("32", "Khaki", "59.99", 35),
                variant("34", "Khaki", "59.99", 20),
                variant("30", "Navy", "59.99", 25),
                variant("32", "Navy", "59.99", 35),
                variant("34", "Navy", "59.99", 20),
                variant("32", "Black", "64.99", 30),
                variant("34", "Black", "64.99", 20));

        createProduct("Floral Maxi Dress", womens, "Elegance",
                "Beautiful ankle-length maxi dress with a vibrant floral print. Lightweight and flowy for summer days.",
                "79.99", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
                variant("XS", "Red Floral", "79.99", 15),
                variant("S", "Red Floral", "79.99", 25),
                variant("M", "Red Floral", "79.99", 30),
                variant("L", "Red Floral", "79.99", 20),
                variant("XL", "Red Floral", "79.99", 10),
                variant("S", "Blue Floral", "79.99", 20),
                variant("M", "Blue Floral", "79.99", 25),
                variant("L", "Blue Floral", "79.99", 15));

        createProduct("Cashmere Sweater", womens, "Luxe Knitwear",
                "Ultra-soft cashmere crewneck sweater. A luxurious layering essential for cooler months.",
                "129.99", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
                variant("S", "Beige", "129.99", 20),
                variant("M", "Beige", "129.99", 30),
                variant("L", "Beige", "129.99", 20),
                variant("S", "Grey", "129.99", 20),
                variant("M", "Grey", "129.99", 30),
                variant("L", "Grey", "129.99", 20),
                variant("M", "Burgundy", "139.99", 20),
                variant("L", "Burgundy", "139.99", 15));

        createProduct("Running Sneakers", shoesCat, "AirStep",
                "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.",
                "89.99", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
                variant("7", "White", "89.99", 20),
                variant("8", "White", "89.99", 30),
                variant("9", "White", "89.99", 35),
                variant("10", "White", "89.99", 25),
                variant("11", "White", "89.99", 15),
                variant("8", "Black", "89.99", 25),
                variant("9", "Black", "89.99", 30),
                variant("10", "Black", "89.99", 20),
                variant("9", "Red", "94.99", 20),
                variant("10", "Red", "94.99", 15));

        createProduct("Leather Loafers", shoesCat, "Prime & Co",
                "Handcrafted Italian leather loafers with classic penny strap. Sophisticated style with lasting comfort.",
                "149.99", "https://images.unsplash.com/photo-1614251056216-f299f9f2b382?w=400",
                variant("7", "Brown", "149.99", 15),
                variant("8", "Brown", "149.99", 25),
                variant("9", "Brown", "149.99", 30),
                variant("10", "Brown", "149.99", 20),
                variant("7", "Black", "149.99", 15),
                variant("8", "Black", "149.99", 25),
                variant("9", "Black", "149.99", 30),
                variant("10", "Black", "149.99", 20));

        createProduct("Silk Twill Scarf", accessories, "Maison Luxe",
                "Luxurious 100% silk twill scarf with hand-rolled edges. A versatile statement piece.",
                "69.99", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
                variant("One Size", "Red", "69.99", 30),
                variant("One Size", "Blue", "69.99", 25),
                variant("One Size", "Gold", "79.99", 20));

        createProduct("Leather Belt", accessories, "Heritage Leather",
                "Full-grain leather belt with brushed buckle. Ages beautifully with every wear.",
                "44.99", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
                variant("S (30-32)", "Brown", "44.99", 25),
                variant("M (34-36)", "Brown", "44.99", 35),
                variant("L (38-40)", "Brown", "44.99", 20),
                variant("S (30-32)", "Black", "44.99", 25),
                variant("M (34-36)", "Black", "44.99", 35),
                variant("L (38-40)", "Black", "44.99", 20));
    }

    @SafeVarargs
    private void createProduct(String name, Category category, String brand,
                                String description, String basePrice, String imageUrl,
                                List<ProductVariant>... variantGroups) {
        Product product = Product.builder()
                .name(name)
                .category(category)
                .brand(brand)
                .description(description)
                .basePrice(new BigDecimal(basePrice))
                .coverImageUrl(imageUrl)
                .build();

        List<ProductVariant> allVariants = new java.util.ArrayList<>();
        for (List<ProductVariant> group : variantGroups) {
            for (ProductVariant v : group) {
                v.setProduct(product);
                allVariants.add(v);
            }
        }
        product.setVariants(allVariants);

        productRepository.save(product);
    }

    private List<ProductVariant> variant(String size, String color, String price, int stock) {
        return List.of(ProductVariant.builder()
                .size(size)
                .color(color)
                .price(new BigDecimal(price))
                .stockQty(stock)
                .build());
    }
}
