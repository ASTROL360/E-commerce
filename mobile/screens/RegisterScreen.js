import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import { colors } from "../constants/colors";
import { register } from "../store/slices/authSlice";
import { requireFields, validateEmail } from "../utils/validators";

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [localError, setLocalError] = useState("");

  function submit() {
    const missing = requireFields({ Name: form.name, Email: form.email, Password: form.password });
    if (missing) return setLocalError(missing);
    if (!validateEmail(form.email)) return setLocalError("Enter a valid email address.");
    if (form.password.length < 6) return setLocalError("Password must be at least 6 characters.");
    setLocalError("");
    dispatch(register({ name: form.name.trim(), email: form.email.trim(), password: form.password }));
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start your Fashion Store profile.</Text>
        <ErrorMessage message={localError || error} />
        <Input label="Name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
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
        <Button title="Register" onPress={submit} loading={loading} />
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
