import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/helpers";

export default function ProductCard({ product, onEdit, onDelete, onOpenAuth }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState({});
  const [imgError, setImgError] = useState(false);
  const variants = product.variants || [];

  function getQty(variantId) {
    return quantities[variantId] || 1;
  }

  function setQty(variantId, val) {
    const n = Math.max(1, Math.min(val, 99));
    setQuantities((prev) => ({ ...prev, [variantId]: n }));
  }

  async function handleAddToCart(variantId) {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    await addItem(variantId, getQty(variantId));
  }

  return (
    <article className="product-card">
      <div className="product-image">
        {product.coverImageUrl && !imgError ? (
          <img
            src={product.coverImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
          />
        ) : (
          "No image"
        )}
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.categoryName || "Uncategorized"}</span>
          <span>{product.brand || ""}</span>
        </div>
        <div>
          <strong>{product.name}</strong>
          <p>{product.description || ""}</p>
        </div>
        <span className="price">{formatCurrency(product.basePrice)}</span>
        {variants.map((variant) => (
          <div className="variant-row" key={variant.id}>
            <div>
              <strong>
                {variant.size} / {variant.color}
              </strong>
              <small>
                {formatCurrency(variant.price)} - {variant.stockQty} in stock
              </small>
            </div>
            <div className="variant-actions">
              <label className="qty-label">
                Qty:
                <input
                  type="number"
                  className="qty-input"
                  min="1"
                  max="99"
                  value={getQty(variant.id)}
                  onChange={(e) => setQty(variant.id, Number(e.target.value))}
                />
              </label>
              <button
                className="secondary-button"
                type="button"
                disabled={variant.stockQty < 1}
                onClick={() => handleAddToCart(variant.id)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
        {isAdmin && (
          <>
            <button className="secondary-button" type="button" onClick={() => onEdit(product)}>
              Edit Product
            </button>
            <button className="danger-button" type="button" onClick={() => onDelete(product.id)}>
              Deactivate
            </button>
          </>
        )}
      </div>
    </article>
  );
}
