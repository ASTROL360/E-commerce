import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";

export default function ProductSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.line} />
      <View style={[styles.line, styles.short]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  image: {
    height: 130,
    borderRadius: 8,
    backgroundColor: colors.soft,
  },
  line: {
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.soft,
  },
  short: {
    width: "55%",
  },
});
