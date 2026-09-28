import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection.js";

import authRoutes from "./routes/authenticationRoutes.js";
import profileRoutes from "./routes/userProfileRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration - Allows Localhost, Netlify, and your CLIENT_URL env variable
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, 
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/auth", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root Health Check
app.get("/", (req, res) => res.json({ status: "Online", message: "Urban Craft. Core API Active" }));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server Running]: Port ${PORT}`));