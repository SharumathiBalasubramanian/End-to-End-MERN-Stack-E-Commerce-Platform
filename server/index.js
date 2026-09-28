import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection.js";
import authenticationRoutes from "./routes/authenticationRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Essential Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Essential: parses JSON bodies from frontend
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authenticationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));