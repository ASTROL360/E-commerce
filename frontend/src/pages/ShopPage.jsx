import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ShopPage({ onEditProduct, onOpenAuth }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);

  const loadProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (search) params.set("q", search);
    const page = await api(`/products${params.toString() ? `?${params}` : ""}`);
    setProducts(page.content || []);
  }, [categoryFilter, search]);

  const loadCategories = useCallback(async () => {
    const data = await api("/categories");
    setCategories(data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function showAlert(msg) {
    setAlert(msg);
    setTimeout(() => setAlert(null), 4800);
  }

  async function handleDelete(id) {
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      await loadProducts();
      showAlert("Product deactivated.");
    } catch (err) {
      showAlert(err.message);
    }
  }

  return (
    <>
      {alert && <div className="alert">{alert}</div>}
      <div className="toolbar">
        <div className="search-box">
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="secondary-button" type="button" onClick={loadProducts}>
            Search
          </button>
        </div>
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={handleDelete}
            onOpenAuth={onOpenAuth}
          />
        ))}
      </div>
      {products.length === 0 && (
        <div className="empty">
          No products yet. Login as admin and add your first item.
        </div>
      )}
    </>
  );
}
