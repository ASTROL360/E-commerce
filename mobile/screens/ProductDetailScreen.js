import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import { colors } from "../constants/colors";
import { addToCart } from "../store/slices/cartSlice";
import { clearSelectedProduct, fetchProductById } from "../store/slices/productsSlice";
import { currency, getProductPrice } from "../utils/helpers";

export default function ProductDetailScreen({ route }) {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { selectedProduct, detailLoading, error } = useSelector((state) => state.products);
  const cartLoading = useSelector((state) => state.cart.loading);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, productId]);

  if (detailLoading || !selectedProduct) {
    return <Spinner fullScreen />;
  }

  const image = selectedProduct.imageUrl || selectedProduct.coverImageUrl;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ErrorMessage message={error} />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="shirt-outline" size={58} color={colors.muted} />
        </View>
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{selectedProduct.name}</Text>
        <Text style={styles.price}>{currency.format(getProductPrice(selectedProduct))}</Text>
        <Text style={styles.description}>
          {selectedProduct.description || "No description available for this product."}
        </Text>
        <Button
          title="Add to Cart"
          loading={cartLoading}
          onPress={() => dispatch(addToCart({ productId: selectedProduct.id, quantity: 1 }))}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 18,
    gap: 16,
    backgroundColor: colors.background,
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
  details: {
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  price: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "900",
  },
  description: {
    color: colors.muted,
    lineHeight: 22,
  },
});
