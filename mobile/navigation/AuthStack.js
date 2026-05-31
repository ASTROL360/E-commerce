import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { ROUTES } from "../constants/routes";
import { colors } from "../constants/colors";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: "900" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ title: "Login" }} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} options={{ title: "Create Account" }} />
    </Stack.Navigator>
  );
}
