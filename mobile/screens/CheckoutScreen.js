import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import { colors } from "../constants/colors";
import { ROUTES } from "../constants/routes";
import { placeOrder } from "../store/slices/orderSlice";
import { currency } from "../utils/helpers";

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const cartTotal = useSelector((state) => state.cart.total);
  const { loading, error } = useSelector((state) => state.orders);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [localError, setLocalError] = useState("");

  async function submit() {
    if (!shippingAddress.trim()) {
      setLocalError("Shipping address is required.");
      return;
    }
    setLocalError("");
    const result = await dispatch(placeOrder({ shippingAddress: shippingAddress.trim(), paymentMethod }));
    if (placeOrder.fulfilled.match(result)) {
      Alert.alert("Order placed", "Your order has been created successfully.");
      navigation.navigate(ROUTES.ORDERS);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.total}>{currency.format(cartTotal)}</Text>
        <ErrorMessage message={localError || error} />
        <Input
          label="Shipping Address"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          multiline
          inputStyle={styles.textArea}
        />
        <Input label="Payment Method" value={paymentMethod} onChangeText={setPaymentMethod} />
        <Button title="Place Order" onPress={submit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  total: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },
  textArea: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});
