const state = {
  apiBase: localStorage.getItem("fashionStoreApiBase") || "http://localhost:8081/api",
  token: localStorage.getItem("fashionStoreToken") || "",
  user: JSON.parse(localStorage.getItem("fashionStoreUser") || "null"),
  products: [],
  categories: [],
  cart: [],
  orders: [],
  view: "shop",
  authMode: "login",
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const el = (id) => document.getElementById(id);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function showAlert(message, type = "warn") {
  const alert = el("alert");
  alert.textContent = message;
  alert.classList.remove("hidden");
  alert.style.background = type === "ok" ? "#e8f5ed" : "#fff7e6";
  alert.style.color = type === "ok" ? "#166534" : "#9a5b00";
  window.clearTimeout(showAlert.timer);
  showAlert.timer = window.setTimeout(() => alert.classList.add("hidden"), 4800);
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  let response;
  try {
    response = await fetch(`${state.apiBase}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error("Backend is offline. Start Spring Boot on port 8081 and try again.");
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

function setSession(auth) {
  state.token = auth.token;
  state.user = {
    name: auth.name,
    email: auth.email,
    role: auth.role,
  };
  localStorage.setItem("fashionStoreToken", state.token);
  localStorage.setItem("fashionStoreUser", JSON.stringify(state.user));
  renderShell();
}

function clearSession() {
  state.token = "";
  state.user = null;
  state.cart = [];
  state.orders = [];
  localStorage.removeItem("fashionStoreToken");
  localStorage.removeItem("fashionStoreUser");
  renderShell();
  renderCart();
  renderOrders();
}

function renderShell() {
  el("api-base").value = state.apiBase;
  el("cart-count").textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const isLoggedIn = Boolean(state.user);
  const isAdmin = state.user?.role === "ADMIN";
  el("auth-button").classList.toggle("hidden", isLoggedIn);
  el("logout-button").classList.toggle("hidden", !isLoggedIn);
  el("user-chip").classList.toggle("hidden", !isLoggedIn);
  el("user-chip").textContent = isLoggedIn ? `${state.user.name} - ${state.user.role}` : "";
  qsa(".admin-only").forEach((node) => node.classList.toggle("hidden", !isAdmin));
}

function setView(view) {
  state.view = view;
  qsa(".view").forEach((node) => node.classList.remove("active"));
  qsa(".nav-item").forEach((node) => node.classList.remove("active"));
  el(`${view}-view`).classList.add("active");
  document.querySelector(`[data-view="${view}"]`)?.classList.add("active");

  const titles = {
    shop: ["Shop", "Browse products, manage cart, and checkout."],
    cart: ["Cart", "Review selected items before checkout."],
    orders: ["Orders", "Track your order history."],
    admin: ["Admin", "Manage categories, products, and order status."],
  };
  el("view-title").textContent = titles[view][0];
  el("view-subtitle").textContent = titles[view][1];

  if (view === "cart") loadCart();
  if (view === "orders") loadOrders();
  if (view === "admin") loadAdminData();
}

function imageBlock(url, name) {
  if (!url) return `<div class="product-image">No image</div>`;
  return `<div class="product-image"><img src="${escapeHtml(url)}" alt="${escapeHtml(name)}" /></div>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderProducts() {
  const grid = el("product-grid");
  el("empty-products").classList.toggle("hidden", state.products.length > 0);
  grid.innerHTML = state.products.map((product) => {
    const variants = product.variants || [];
    return `
      <article class="product-card">
        ${imageBlock(product.coverImageUrl, product.name)}
        <div class="product-body">
          <div class="product-meta">
            <span>${escapeHtml(product.categoryName || "Uncategorized")}</span>
            <span>${escapeHtml(product.brand || "")}</span>
          </div>
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <p>${escapeHtml(product.description || "")}</p>
          </div>
          <span class="price">${money.format(Number(product.basePrice || 0))}</span>
          ${variants.map((variant) => `
            <div class="variant-row">
              <div>
                <strong>${escapeHtml(variant.size)} / ${escapeHtml(variant.color)}</strong>
                <small>${money.format(Number(variant.price || 0))} - ${variant.stockQty} in stock</small>
              </div>
              <button class="secondary-button" type="button" data-add-cart="${variant.id}" ${variant.stockQty < 1 ? "disabled" : ""}>Add</button>
            </div>
          `).join("")}
          ${state.user?.role === "ADMIN" ? `
            <button class="secondary-button" type="button" data-edit-product="${product.id}">Edit Product</button>
            <button class="danger-button" type="button" data-delete-product="${product.id}">Deactivate</button>
          ` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function renderCategoryOptions() {
  const options = ['<option value="">All categories</option>']
    .concat(state.categories.map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`))
    .join("");
  el("category-filter").innerHTML = options;

  const productOptions = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  el("product-category").innerHTML = productOptions;
}

function renderCategoriesAdmin() {
  el("category-list").innerHTML = state.categories.map((category) => `
    <div class="compact-item">
      <div>
        <strong>${escapeHtml(category.name)}</strong>
        <small>${escapeHtml(category.slug)}</small>
      </div>
      <button class="secondary-button" type="button" data-edit-category="${category.id}">Edit</button>
      <button class="danger-button" type="button" data-delete-category="${category.id}">Delete</button>
    </div>
  `).join("");
}

function renderCart() {
  const list = el("cart-list");
  const total = state.cart.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
  el("cart-count").textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  el("cart-total").textContent = money.format(total);

  if (!state.user) {
    list.innerHTML = '<div class="empty">Login to view your cart.</div>';
    return;
  }

  if (!state.cart.length) {
    list.innerHTML = '<div class="empty">Your cart is empty.</div>';
    return;
  }

  list.innerHTML = state.cart.map((item) => `
    <article class="cart-item">
      <div class="cart-line">
        <div>
          <strong>${escapeHtml(item.productName)}</strong>
          <p>${escapeHtml(item.size)} / ${escapeHtml(item.color)} - ${money.format(Number(item.unitPrice || 0))}</p>
        </div>
        <input class="quantity-input" type="number" min="1" value="${item.quantity}" data-cart-qty="${item.id}" />
        <button class="danger-button" type="button" data-remove-cart="${item.id}">Remove</button>
      </div>
    </article>
  `).join("");
}

function renderOrders() {
  const list = el("orders-list");
  el("empty-orders").classList.toggle("hidden", state.orders.length > 0);

  if (!state.user) {
    list.innerHTML = '<div class="empty">Login to view orders.</div>';
    return;
  }

  list.innerHTML = state.orders.map(orderTemplate).join("");
}

function orderTemplate(order, admin = false) {
  const items = (order.items || []).map((item) => `
    <li>${escapeHtml(item.productName)} - ${escapeHtml(item.size)} / ${escapeHtml(item.color)} x ${item.quantity}</li>
  `).join("");

  return `
    <article class="order-card">
      <div class="order-head">
        <div>
          <strong>${money.format(Number(order.totalAmount || 0))}</strong>
          <p>${escapeHtml(order.shippingAddress || "")}</p>
        </div>
        <span class="badge">${escapeHtml(order.status)}</span>
      </div>
      <ul>${items}</ul>
      ${admin ? `
        <select data-order-status="${order.id}">
          ${["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => `
            <option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      ` : ""}
    </article>
  `;
}

function renderVariantRows(variants = []) {
  const list = el("variant-list");
  list.innerHTML = variants.map((variant) => variantRow(variant)).join("") || variantRow();
}

function variantRow(variant = {}) {
  return `
    <div class="variant-form-row">
      <input placeholder="Size" value="${escapeHtml(variant.size || "")}" data-variant-field="size" required />
      <input placeholder="Color" value="${escapeHtml(variant.color || "")}" data-variant-field="color" required />
      <input placeholder="Price" type="number" min="1" step="0.01" value="${variant.price || ""}" data-variant-field="price" required />
      <input placeholder="Stock" type="number" min="0" value="${variant.stockQty ?? ""}" data-variant-field="stockQty" required />
      <input placeholder="SKU" value="${escapeHtml(variant.sku || "")}" data-variant-field="sku" />
      <button class="danger-button" type="button" data-remove-variant>Remove</button>
    </div>
  `;
}

async function loadProducts() {
  const categoryId = el("category-filter").value;
  const q = el("search-input").value.trim();
  const params = new URLSearchParams();
  if (categoryId) params.set("categoryId", categoryId);
  if (q) params.set("q", q);
  const page = await api(`/products${params.toString() ? `?${params}` : ""}`);
  state.products = page.content || [];
  renderProducts();
}

async function loadCategories() {
  state.categories = await api("/categories");
  renderCategoryOptions();
  renderCategoriesAdmin();
}

async function loadCart() {
  if (!state.user) {
    renderCart();
    return;
  }
  state.cart = await api("/cart");
  renderCart();
}

async function loadOrders() {
  if (!state.user) {
    renderOrders();
    return;
  }
  state.orders = await api("/orders");
  renderOrders();
}

async function loadAdminData() {
  await loadCategories();
  await loadProducts();
  el("admin-orders").innerHTML = state.orders.map((order) => orderTemplate(order, true)).join("");
}

async function initData() {
  try {
    await loadCategories();
    await loadProducts();
    if (state.user) {
      await loadCart();
      await loadOrders();
    }
  } catch (error) {
    showAlert(error.message);
  }
}

function collectVariants() {
  return qsa(".variant-form-row").map((row) => {
    const data = {};
    row.querySelectorAll("[data-variant-field]").forEach((input) => {
      const field = input.dataset.variantField;
      data[field] = field === "price" ? Number(input.value) : field === "stockQty" ? Number(input.value) : input.value;
    });
    return data;
  }).filter((variant) => variant.size && variant.color && variant.price > 0);
}

function resetProductForm() {
  el("product-id").value = "";
  el("product-form").reset();
  renderVariantRows();
}

function fillProductForm(product) {
  el("product-id").value = product.id;
  el("product-name").value = product.name || "";
  el("product-brand").value = product.brand || "";
  el("product-price").value = product.basePrice || "";
  el("product-category").value = product.categoryId || "";
  el("product-image").value = product.coverImageUrl || "";
  el("product-description").value = product.description || "";
  renderVariantRows(product.variants || []);
  setView("admin");
}

function bindEvents() {
  qsa(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  el("save-api").addEventListener("click", async () => {
    state.apiBase = el("api-base").value.replace(/\/$/, "");
    localStorage.setItem("fashionStoreApiBase", state.apiBase);
    await initData();
    showAlert("API base saved.", "ok");
  });

  el("auth-button").addEventListener("click", () => el("auth-dialog").showModal());
  el("logout-button").addEventListener("click", () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");
    if (shouldLogout) clearSession();
  });

  el("toggle-auth-mode").addEventListener("click", () => {
    state.authMode = state.authMode === "login" ? "register" : "login";
    el("auth-title").textContent = state.authMode === "login" ? "Login" : "Create Account";
    el("toggle-auth-mode").textContent = state.authMode === "login" ? "Create account" : "Use login";
    qsa(".register-field").forEach((node) => node.classList.toggle("hidden", state.authMode === "login"));
  });

  el("auth-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      email: el("auth-email").value,
      password: el("auth-password").value,
    };
    if (state.authMode === "register") payload.name = el("auth-name").value;

    try {
      const auth = await api(`/auth/${state.authMode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSession(auth);
      el("auth-dialog").close();
      await initData();
      showAlert("You are signed in.", "ok");
    } catch (error) {
      showAlert(error.message);
    }
  });

  el("search-button").addEventListener("click", () => loadProducts().catch((error) => showAlert(error.message)));
  el("category-filter").addEventListener("change", () => loadProducts().catch((error) => showAlert(error.message)));

  document.body.addEventListener("click", async (event) => {
    const addId = event.target.dataset.addCart;
    const editProductId = event.target.dataset.editProduct;
    const deleteProductId = event.target.dataset.deleteProduct;
    const removeCartId = event.target.dataset.removeCart;
    const editCategoryId = event.target.dataset.editCategory;
    const deleteCategoryId = event.target.dataset.deleteCategory;

    try {
      if (addId) {
        if (!state.user) {
          el("auth-dialog").showModal();
          return;
        }
        await api("/cart/items", { method: "POST", body: JSON.stringify({ variantId: addId, quantity: 1 }) });
        await loadCart();
        showAlert("Added to cart.", "ok");
      }

      if (editProductId) {
        const product = state.products.find((item) => item.id === editProductId);
        if (product) fillProductForm(product);
      }

      if (deleteProductId) {
        await api(`/products/${deleteProductId}`, { method: "DELETE" });
        await loadProducts();
        showAlert("Product deactivated.", "ok");
      }

      if (removeCartId) {
        await api(`/cart/items/${removeCartId}`, { method: "DELETE" });
        await loadCart();
      }

      if (editCategoryId) {
        const category = state.categories.find((item) => item.id === editCategoryId);
        el("category-id").value = category.id;
        el("category-name").value = category.name;
        el("category-slug").value = category.slug;
        el("category-image").value = category.imageUrl || "";
      }

      if (deleteCategoryId) {
        await api(`/categories/${deleteCategoryId}`, { method: "DELETE" });
        await loadCategories();
      }

      if (event.target.dataset.removeVariant !== undefined) {
        event.target.closest(".variant-form-row").remove();
      }
    } catch (error) {
      showAlert(error.message);
    }
  });

  document.body.addEventListener("change", async (event) => {
    const cartId = event.target.dataset.cartQty;
    const orderId = event.target.dataset.orderStatus;
    try {
      if (cartId) {
        await api(`/cart/items/${cartId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity: Number(event.target.value) }),
        });
        await loadCart();
      }

      if (orderId) {
        await api(`/orders/${orderId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: event.target.value }),
        });
        showAlert("Order status updated.", "ok");
      }
    } catch (error) {
      showAlert(error.message);
    }
  });

  el("checkout-button").addEventListener("click", async () => {
    try {
      await api("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ shippingAddress: el("shipping-address").value }),
      });
      el("shipping-address").value = "";
      await loadCart();
      await loadOrders();
      setView("orders");
      showAlert("Checkout complete.", "ok");
    } catch (error) {
      showAlert(error.message);
    }
  });

  el("category-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = el("category-id").value;
    const payload = {
      name: el("category-name").value,
      slug: el("category-slug").value,
      imageUrl: el("category-image").value,
    };
    try {
      await api(id ? `/categories/${id}` : "/categories", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      el("category-form").reset();
      el("category-id").value = "";
      await loadCategories();
      showAlert("Category saved.", "ok");
    } catch (error) {
      showAlert(error.message);
    }
  });

  el("add-variant").addEventListener("click", () => {
    el("variant-list").insertAdjacentHTML("beforeend", variantRow());
  });

  el("reset-product").addEventListener("click", resetProductForm);

  el("product-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = el("product-id").value;
    const payload = {
      name: el("product-name").value,
      description: el("product-description").value,
      brand: el("product-brand").value,
      basePrice: Number(el("product-price").value),
      categoryId: el("product-category").value,
      coverImageUrl: el("product-image").value,
      variants: collectVariants(),
    };
    try {
      await api(id ? `/products/${id}` : "/products", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      resetProductForm();
      await loadProducts();
      showAlert("Product saved.", "ok");
    } catch (error) {
      showAlert(error.message);
    }
  });
}

bindEvents();
renderShell();
renderVariantRows();
initData();
