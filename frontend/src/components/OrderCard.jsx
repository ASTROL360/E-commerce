import { formatCurrency } from "../utils/helpers";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderCard({ order, admin = false, onStatusChange }) {
  const items = (order.items || []).map((item) => (
    <li key={item.variantId}>
      {item.productName} - {item.size} / {item.color} x {item.quantity}
    </li>
  ));

  return (
    <article className="order-card">
      <div className="order-head">
        <div>
          <strong>{formatCurrency(order.totalAmount)}</strong>
          <p>{order.shippingAddress || ""}</p>
        </div>
        <span className="badge">{order.status}</span>
      </div>
      <ul>{items}</ul>
      {admin && (
        <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
    </article>
  );
}
