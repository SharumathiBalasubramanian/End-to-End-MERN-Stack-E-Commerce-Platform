import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

// 1. MUST BE AT THE TOP: Specific route for categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const cleanCategories = (categories || []).filter((cat) => Boolean(cat));

    // Fallback if no categories exist yet in DB
    if (cleanCategories.length === 0) {
      return res.status(200).json([
        "All",
        "Home Decor",
        "Pottery",
        "Woodcraft",
        "Accessories",
      ]);
    }

    res.status(200).json(cleanCategories);
  } catch (error) {
    console.error("Categories route error:", error);
    // Return fallback categories instead of crashing with 500
    res.status(200).json([
      "All",
      "Home Decor",
      "Pottery",
      "Woodcraft",
      "Accessories",
    ]);
  }
});

// 2. GENERAL ROUTE: List all products with filtering & sorting
router.get("/", async (req, res) => {
  try {
    const { category, sort, limit = 50 } = req.query;

    const query = {};
    if (category && category !== "All") {
      query.category = category;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price-low") sortOptions = { price: 1 };
    if (sort === "price-high") sortOptions = { price: -1 };

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit));

    res.status(200).json(products);
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch products" });
  }
});

// 3. MUST BE AT THE BOTTOM: Parameterized route matching /:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Guard against CastError if a non-ObjectId string reaches here
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found (Invalid ID)" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Single product error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch product" });
  }
});

export default router;