package com.fashionstore.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fashionstore.backend.dto.request.RegisterRequest;
import com.fashionstore.backend.model.Category;
import com.fashionstore.backend.model.Product;
import com.fashionstore.backend.model.ProductVariant;
import com.fashionstore.backend.repository.CategoryRepository;
import com.fashionstore.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void registerReturnsTokenAndRejectsDuplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test-user@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("CUSTOMER"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void cartRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    void productListReturnsCategoryAndVariantsWithOpenInViewDisabled() throws Exception {
        Category category = categoryRepository.save(Category.builder()
                .name("Shirts")
                .slug("shirts")
                .build());

        Product product = Product.builder()
                .name("Oxford Shirt")
                .description("Cotton shirt")
                .brand("Tailor")
                .basePrice(new BigDecimal("25000.00"))
                .category(category)
                .build();

        product.getVariants().add(ProductVariant.builder()
                .product(product)
                .size("M")
                .color("White")
                .price(new BigDecimal("25000.00"))
                .stockQty(5)
                .sku("OXFORD-WHT-M")
                .build());

        productRepository.save(product);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].categoryName").value("Shirts"))
                .andExpect(jsonPath("$.content[0].variants", hasSize(1)))
                .andExpect(jsonPath("$.content[0].variants[0].sku").value("OXFORD-WHT-M"));
    }
}
