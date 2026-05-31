import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import { colors } from "../constants/colors";
import { clearCart } from "../store/slices/cartSlice";
import { logoutUser } from "../store/slices/authSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  function confirmLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(clearCart());
          dispatch(logoutUser());
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>{user?.name || "Customer"}</Text>
        <Text style={styles.line}>{user?.email || "No email available"}</Text>
        {user?.role ? <Text style={styles.badge}>{user.role}</Text> : null}
        <Button title="Logout" variant="danger" onPress={confirmLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
    backgroundColor: colors.background,
  },
  card: {
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  line: {
    color: colors.muted,
  },
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    backgroundColor: colors.successSoft,
    color: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontWeight: "900",
  },
});
