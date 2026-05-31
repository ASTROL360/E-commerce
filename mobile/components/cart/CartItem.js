import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../common/Button";
import { colors } from "../../constants/colors";
import { currency, getItemPrice } from "../../utils/helpers";

export default function CartItem({ item, onIncrement, onDecrement, onRemove, loading }) {
  const quantity = Number(item.quantity || 1);
  const name = item.productName || item.name || item.product?.name || "Product";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.price}>{currency.format(getItemPrice(item))}</Text>
        </View>
        <Button title="Remove" variant="danger" onPress={onRemove} disabled={loading} style={styles.removeButton} />
      </View>
      <View style={styles.qtyRow}>
        <Button title="-" variant="secondary" onPress={onDecrement} disabled={loading || quantity <= 1} style={styles.qtyButton} />
        <Text style={styles.qty}>{quantity}</Text>
        <Button title="+" variant="secondary" onPress={onIncrement} disabled={loading} style={styles.qtyButton} />
        <Ionicons name="cube-outline" size={20} color={colors.muted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  price: {
    color: colors.primary,
    fontWeight: "900",
  },
  removeButton: {
    minHeight: 40,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyButton: {
    minHeight: 40,
    width: 44,
    paddingHorizontal: 0,
  },
  qty: {
    minWidth: 30,
    textAlign: "center",
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
});
