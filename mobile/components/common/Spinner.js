import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";

export default function Spinner({ fullScreen = false }) {
  return (
    <View style={[styles.wrap, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
