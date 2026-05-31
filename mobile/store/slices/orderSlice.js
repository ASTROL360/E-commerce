import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/client";
import endpoints from "../../api/endpoints";
import { getErrorMessage } from "../../utils/errorHandler";
import { normalizeList } from "../../utils/helpers";
import { clearCart } from "./cartSlice";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(endpoints.orders.list);
    return normalizeList(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load orders."));
  }
});

export const placeOrder = createAsyncThunk("orders/placeOrder", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await apiClient.post(endpoints.orders.create, payload);
    dispatch(clearCart());
    await dispatch(fetchOrders()).unwrap();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to place order."));
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    latestOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.latestOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
