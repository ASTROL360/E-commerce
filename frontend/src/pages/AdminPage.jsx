import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import VariantEditor from "../components/VariantEditor";
import OrderCard from "../components/OrderCard";

const emptyVariant = () => [{}];

export default function AdminPage({ editProduct, onClearEdit }) {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState(null);

  const [catId, setCatId] = useState("");
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catImage, setCatImage] = useState("");

  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [variants, setVariants] = useState(emptyVariant);

  const showAlert = useCallback((msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 4800);
  }, []);

  const loadCategories = useCallback(async () => {
    const data = await api("/categories");
    setCategories(data);
  }, []);

  const loadOrders = useCallback(async () => {
    const data = await api("/orders/all");
    setOrders(data);
  }, []);

  useEffect(() => {
    loadCategories();
    loadOrders();
  }, [loadCategories, loadOrders]);

  useEffect(() => {
    if (editProduct) {
      setProdId(editProduct.id);
      setProdName(editProduct.name || "");
      setProdBrand(editProduct.brand || "");
      setProdPrice(editProduct.basePrice || "");
      setProdCategory(editProduct.categoryId || "");
      setProdImage(editProduct.coverImageUrl || "");
      setProdDesc(editProduct.description || "");
      setVariants(editProduct.variants || emptyVariant());
    }
  }, [editProduct]);

  function resetProduct() {
    setProdId("");
    setProdName("");
    setProdBrand("");
    setProdPrice("");
    setProdCategory("");
    setProdImage("");
    setProdDesc("");
    setVariants(emptyVariant());
    if (onClearEdit) onClearEdit();
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    try {
      const payload = { name: catName, slug: catSlug, imageUrl: catImage };
      if (catId) {
        await api(`/categories/${catId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api("/categories", { method: "POST", body: JSON.stringify(payload) });
      }
      setCatId("");
      setCatName("");
      setCatSlug("");
      setCatImage("");
      await loadCategories();
      showAlert("Category saved.");
    } catch (err) {
      showAlert(err.message);
    }
  }

  async function handleProductSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        name: prodName,
        description: prodDesc,
        brand: prodBrand,
        basePrice: Number(prodPrice),
        categoryId: prodCategory,
        coverImageUrl: prodImage,
        variants: variants.filter((v) => v.size && v.color && v.price > 0),
      };
      if (prodId) {
        await api(`/products/${prodId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api("/products", { method: "POST", body: JSON.stringify(payload) });
      }
      resetProduct();
      showAlert("Product saved.");
    } catch (err) {
      showAlert(err.message);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await api(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadOrders();
      showAlert("Order status updated.");
    } catch (err) {
      showAlert(err.message);
    }
  }

  function editCategory(cat) {
    setCatId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatImage(cat.imageUrl || "");
  }

  async function deleteCategory(id) {
    try {
      await api(`/categories/${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (err) {
      showAlert(err.message);
    }
  }

  return (
    <>
      {alert && <div className="alert">{alert}</div>}
      <div className="admin-layout">
        <section className="panel">
          <h2>Category</h2>
          <form className="form-grid" onSubmit={handleCategorySubmit}>
            <input type="hidden" value={catId} />
            <label>
              Name
              <input value={catName} onChange={(e) => setCatName(e.target.value)} required />
            </label>
            <label>
              Slug
              <input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} required />
            </label>
            <label>
              Image URL
              <input value={catImage} onChange={(e) => setCatImage(e.target.value)} />
            </label>
            <button className="primary-button" type="submit">
              Save Category
            </button>
          </form>
          <div className="compact-list">
            {categories.map((cat) => (
              <div className="compact-item" key={cat.id}>
                <div>
                  <strong>{cat.name}</strong>
                  <small>{cat.slug}</small>
                </div>
                <button className="secondary-button" type="button" onClick={() => editCategory(cat)}>
                  Edit
                </button>
                <button className="danger-button" type="button" onClick={() => deleteCategory(cat.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Product</h2>
          <form className="form-grid" onSubmit={handleProductSubmit}>
            <input type="hidden" value={prodId} />
            <label>
              Name
              <input value={prodName} onChange={(e) => setProdName(e.target.value)} required />
            </label>
            <label>
              Brand
              <input value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} />
            </label>
            <label>
              Base price
              <input
                type="number"
                min="1"
                step="0.01"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                required
              />
            </label>
            <label>
              Category
              <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} required>
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cover image URL
              <input value={prodImage} onChange={(e) => setProdImage(e.target.value)} />
            </label>
            <label className="wide">
              Description
              <textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />
            </label>
            <VariantEditor variants={variants} onChange={setVariants} />
            <button className="primary-button" type="submit">
              Save Product
            </button>
            <button className="secondary-button" type="button" onClick={resetProduct}>
              Clear
            </button>
          </form>
        </section>

        <section className="panel wide-panel">
          <h2>Order Management</h2>
          <div className="stack">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} admin onStatusChange={handleStatusChange} />
            ))}
          </div>
          {orders.length === 0 && <div className="empty">Admin status updates appear after customers place orders.</div>}
        </section>
      </div>
    </>
  );
}
