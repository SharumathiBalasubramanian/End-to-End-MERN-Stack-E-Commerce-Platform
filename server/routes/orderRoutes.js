import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create order
router.post("/", protect, async (req, res) => {
  try {
    const rawItems = req.body.orderItems || req.body.items || req.body.cartItems;

    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    const { shippingAddress, paymentMethod } = req.body;
    const finalAmount = Number(req.body.totalAmount || req.body.totalPrice || 0);

    const formattedItems = rawItems.map((item) => ({
      product: item._id || item.product,
      name: item.name,
      qty: Number(item.qty || item.quantity || 1),
      quantity: Number(item.qty || item.quantity || 1),
      price: Number(item.price),
      image: item.image || item.imageUrl || "",
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: formattedItems,
      items: formattedItems,
      shippingAddress,
      totalAmount: finalAmount,
      totalPrice: finalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
});

// 2. GET all orders for the logged-in user (MUST BE ABOVE /:id)
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders || []);
  } catch (error) {
    console.error("Error fetching myorders:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
});

// 3. GET single order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;