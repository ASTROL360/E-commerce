import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/cart/CartItem";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import { colors } from "../constants/colors";
import { ROUTES } from "../constants/routes";
import { fetchCart, removeItem, updateQuantity } from "../store/slices/cartSlice";
import { currency } from "../utils/helpers";

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);

  const load = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [load, navigation]);

  if (loading && items.length === 0) return <Spinner fullScreen />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Your cart</Text>
          <ErrorMessage message={error} />
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
      renderItem={({ item }) => (
        <CartItem
          item={item}
          loading={loading}
          onIncrement={() => dispatch(updateQuantity({ item, quantity: Number(item.quantity || 1) + 1 }))}
          onDecrement={() => dispatch(updateQuantity({ item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }))}
          onRemove={() => dispatch(removeItem(item.id))}
        />
      )}
      ListFooterComponent={
        items.length ? (
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>{currency.format(total)}</Text>
            </View>
            <Button title="Proceed to Checkout" onPress={() => navigation.navigate(ROUTES.CHECKOUT)} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 18,
    gap: 14,
    backgroundColor: colors.background,
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    padding: 24,
  },
  footer: {
    gap: 14,
    paddingTop: 6,
  },
  totalLabel: {
    color: colors.muted,
  },
  total: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
});
