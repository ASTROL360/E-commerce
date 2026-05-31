import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/client";
import endpoints from "../../api/endpoints";
import { getErrorMessage } from "../../utils/errorHandler";
import { normalizeList } from "../../utils/helpers";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(endpoints.products.list);
    return normalizeList(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load products."));
  }
});

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(endpoints.products.detail(id));
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load this product."));
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    selectedProduct: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
