import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, val]) => val !== "" && val !== null && val !== undefined)
    );
    const { data } = await axiosInstance.get("/products", { params: cleanedParams });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load catalog");
  }
});

export const fetchProductById = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Product not found");
  }
});

export const fetchCategories = createAsyncThunk("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/products/categories");
    return data.categories || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load categories");
  }
});

export const fetchRecommendations = createAsyncThunk("products/fetchRecommendations", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/analytics/recommendations/${id}`);
    return data.recommendations || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load recommendations");
  }
});