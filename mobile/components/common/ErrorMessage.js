import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff7e6",
    borderColor: "#ffd37a",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  text: {
    color: "#8a5600",
    lineHeight: 19,
  },
});
