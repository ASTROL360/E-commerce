import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart, removeItem, updateQuantity } from "../store/slices/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  return {
    ...cart,
    refreshCart: () => dispatch(fetchCart()),
    addProduct: (payload) => dispatch(addToCart(payload)),
    updateItemQuantity: (payload) => dispatch(updateQuantity(payload)),
    removeCartItem: (id) => dispatch(removeItem(id)),
  };
}
