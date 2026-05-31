import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductCard from "../components/products/ProductCard";
import ProductSkeleton from "../components/products/ProductSkeleton";
import { colors } from "../constants/colors";
import { ROUTES } from "../constants/routes";
import { fetchProducts } from "../store/slices/productsSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  const load = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && list.length === 0) {
    return (
      <View style={styles.skeletonGrid}>
        {[1, 2, 3, 4].map((item) => <ProductSkeleton key={item} />)}
      </View>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Fresh picks</Text>
          <Text style={styles.subtitle}>Browse products from your Spring Boot catalog.</Text>
          <ErrorMessage message={error} />
        </View>
      }
      ListEmptyComponent={!loading ? <Text style={styles.empty}>No products available.</Text> : null}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 18,
    gap: 14,
    backgroundColor: colors.background,
  },
  row: {
    gap: 14,
    marginBottom: 14,
  },
  skeletonGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    padding: 18,
    backgroundColor: colors.background,
  },
  header: {
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    padding: 24,
  },
});
