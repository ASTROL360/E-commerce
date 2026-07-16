import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/helpers";

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <article className="cart-item">
      <div className="cart-line">
        <div>
          <strong>{item.productName}</strong>
          <p>
            {item.size} / {item.color} - {formatCurrency(item.unitPrice)}
          </p>
        </div>
        <input
          className="quantity-input"
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateQty(item.id, Number(e.target.value))}
        />
        <button className="danger-button" type="button" onClick={() => removeItem(item.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}
