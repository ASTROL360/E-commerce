import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import { colors } from "../constants/colors";
import { ROUTES } from "../constants/routes";
import { login } from "../store/slices/authSlice";
import { requireFields, validateEmail } from "../utils/validators";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  async function submit() {
    const missing = requireFields({ Email: form.email, Password: form.password });
    if (missing) return setLocalError(missing);
    if (!validateEmail(form.email)) return setLocalError("Enter a valid email address.");
    setLocalError("");
    dispatch(login({ email: form.email.trim(), password: form.password }));
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue shopping.</Text>
        <ErrorMessage message={localError || error} />
        <Input
          label="Email"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
          secureTextEntry
        />
        <Button title="Login" onPress={submit} loading={loading} />
        <Button title="Create an account" variant="secondary" onPress={() => navigation.navigate(ROUTES.REGISTER)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: colors.background,
  },
  card: {
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginBottom: 4,
  },
});
