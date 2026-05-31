import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import AuthStack from "./AuthStack";
import MainTabNavigator from "./MainTabNavigator";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import { ROUTES } from "../constants/routes";
import { colors } from "../constants/colors";

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: "900" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} options={{ title: "Product" }} />
      <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} options={{ title: "Checkout" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
