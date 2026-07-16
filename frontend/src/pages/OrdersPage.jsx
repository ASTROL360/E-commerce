import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      api("/orders")
        .then(setOrders)
        .catch((err) => setError(err.message));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <div className="empty">Login to view orders.</div>;
  }

  if (error) {
    return <div className="empty error">Failed to load orders: {error}</div>;
  }

  return (
    <div className="stack" id="orders-list">
      {orders.length === 0 && <div className="empty">No orders yet.</div>}
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
