import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/client";
import endpoints from "../../api/endpoints";
import { getErrorMessage } from "../../utils/errorHandler";
import { getItemPrice, getProductIdFromCartItem, normalizeList } from "../../utils/helpers";

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + getItemPrice(item), 0);
}

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(endpoints.cart.list);
    return normalizeList(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load cart."));
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
  try {
    await apiClient.post(endpoints.cart.add, { productId, quantity });
    await dispatch(fetchCart()).unwrap();
    return true;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to add product to cart."));
  }
});

export const updateQuantity = createAsyncThunk("cart/updateQuantity", async ({ item, quantity }, { dispatch, rejectWithValue }) => {
  try {
    const productId = getProductIdFromCartItem(item);
    if (!productId) throw new Error("Missing product id for this cart item.");
    await apiClient.post(endpoints.cart.add, { productId, quantity });
    await dispatch(fetchCart()).unwrap();
    return true;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to update cart quantity."));
  }
});

export const removeItem = createAsyncThunk("cart/removeItem", async (itemId, { dispatch, rejectWithValue }) => {
  try {
    await apiClient.delete(endpoints.cart.remove(itemId));
    await dispatch(fetchCart()).unwrap();
    return itemId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to remove item from cart."));
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = calculateTotal(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
