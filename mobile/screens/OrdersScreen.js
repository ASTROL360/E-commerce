import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import { colors } from "../constants/colors";
import { fetchOrders } from "../store/slices/orderSlice";
import { currency } from "../utils/helpers";

export default function OrdersScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  const load = useCallback(() => {
    dispatch(fetchOrders());
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
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <ErrorMessage message={error} />
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

function OrderCard({ order }) {
  const total = Number(order.total || order.totalAmount || order.amount || 0);
  const items = order.items || order.orderItems || [];
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.orderTotal}>{currency.format(total)}</Text>
        <Text style={styles.badge}>{order.status || "PENDING"}</Text>
      </View>
      <Text style={styles.address}>{order.shippingAddress}</Text>
      {items.map((item, index) => (
        <Text key={`${item.id || item.productId || index}`} style={styles.itemLine}>
          {item.productName || item.name || item.product?.name || "Product"} x {item.quantity || 1}
        </Text>
      ))}
    </View>
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
  card: {
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  orderTotal: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  badge: {
    overflow: "hidden",
    backgroundColor: colors.successSoft,
    color: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontWeight: "900",
  },
  address: {
    color: colors.muted,
  },
  itemLine: {
    color: colors.text,
  },
});
