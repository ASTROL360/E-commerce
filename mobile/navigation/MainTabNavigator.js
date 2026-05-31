import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../constants/colors";
import { ROUTES } from "../constants/routes";

const Tab = createBottomTabNavigator();

const icons = {
  [ROUTES.HOME]: "storefront-outline",
  [ROUTES.CART]: "bag-outline",
  [ROUTES.ORDERS]: "receipt-outline",
  [ROUTES.PROFILE]: "person-outline",
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: "900" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: "Shop" }} />
      <Tab.Screen name={ROUTES.CART} component={CartScreen} />
      <Tab.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
