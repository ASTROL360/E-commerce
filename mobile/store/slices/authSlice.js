import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/client";
import endpoints from "../../api/endpoints";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getErrorMessage } from "../../utils/errorHandler";

function normalizeAuth(data) {
  const token = data?.token;
  const user = data?.user || {
    id: data?.id,
    name: data?.name,
    email: data?.email,
    role: data?.role,
  };
  return { token, user };
}

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post(endpoints.auth.login, payload);
    const auth = normalizeAuth(data);
    if (!auth.token) throw new Error("Login response did not include a token.");
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, auth.token);
    return auth;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Invalid credentials."));
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post(endpoints.auth.register, payload);
    const auth = normalizeAuth(data);
    if (!auth.token) throw new Error("Register response did not include a token.");
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, auth.token);
    return auth;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to create your account."));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
