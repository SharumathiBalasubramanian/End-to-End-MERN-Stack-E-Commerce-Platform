import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const placeOrder = createAsyncThunk("orders/place", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/orders", payload);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Order placement failed");
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/orders/my-orders");
    return data.orders || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
  }
});