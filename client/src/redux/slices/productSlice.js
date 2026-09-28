import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchRecommendations,
} from "../thunks/productThunks.js";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    pages: 1,
    page: 1,
    categories: [],
    filters: { keyword: "", category: "", minPrice: "", maxPrice: "", sort: "newest" },
    selectedProduct: null,
    recommendations: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.recommendations = [];
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
        const raw = action.payload?.products || action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
        state.items = raw;
        state.total = action.payload?.total || raw.length;
        state.pages = action.payload?.pages || 1;
        state.page = action.payload?.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  },
});

export const { setFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;