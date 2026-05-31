import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { currency, getProductPrice } from "../../utils/helpers";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {product.imageUrl || product.coverImageUrl ? (
        <Image source={{ uri: product.imageUrl || product.coverImageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="shirt-outline" size={36} color={colors.muted} />
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.price}>{currency.format(getProductPrice(product))}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.soft,
  },
  placeholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    minHeight: 38,
    color: colors.text,
    fontWeight: "800",
    lineHeight: 19,
  },
  price: {
    color: colors.primary,
    fontWeight: "900",
  },
});
