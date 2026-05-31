import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import Spinner from "./components/common/Spinner";
import { persistor, store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner fullScreen />} persistor={persistor}>
        <StatusBar style="dark" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
