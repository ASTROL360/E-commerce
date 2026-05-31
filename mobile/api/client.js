import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/config";
import { STORAGE_KEYS } from "../constants/storageKeys";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error;
    if (message) {
      error.friendlyMessage = message;
    } else if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      error.friendlyMessage = "Check your internet connection.";
    } else {
      error.friendlyMessage = "Something went wrong. Please try again.";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
