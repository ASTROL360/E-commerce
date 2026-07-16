import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { isLoggedIn } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    const data = await api("/cart");
    setItems(data);
  }, [isLoggedIn]);

  const addItem = useCallback(async (variantId, quantity = 1) => {
    const data = await api("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    });
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.variantId === variantId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = data;
        return updated;
      }
      return [...prev, data];
    });
  }, []);

  const updateQty = useCallback(async (itemId, quantity) => {
    const data = await api(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    setItems((prev) => prev.map((i) => (i.id === itemId ? data : i)));
  }, []);

  const removeItem = useCallback(async (itemId) => {
    await api(`/cart/items/${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      api("/cart")
        .then(setItems)
        .catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, [isLoggedIn]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalCount, fetchCart, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
