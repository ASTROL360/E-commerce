import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../api/client";
import { formatCurrency } from "../utils/helpers";
import CartItemRow from "../components/CartItem";

export default function CartPage() {
  const { isLoggedIn } = useAuth();
  const { items, fetchCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = items.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);

  function showAlert(msg, type = "warn") {
    setAlert(msg);
    setTimeout(() => setAlert(null), 4800);
  }

  async function handleCheckout() {
    try {
      await api("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
      });
      setShippingAddress("");
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      showAlert(err.message);
    }
  }

  if (!isLoggedIn) {
    return <div className="empty">Login to view your cart.</div>;
  }

  return (
    <>
      {alert && <div className="alert">{alert}</div>}
      <div className="stack" id="cart-list">
        {items.length === 0 && <div className="empty">Your cart is empty.</div>}
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>
      {items.length > 0 && (
        <div className="checkout-panel">
          <div>
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <textarea
            placeholder="Shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
          <button className="primary-button" type="button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </>
  );
}
