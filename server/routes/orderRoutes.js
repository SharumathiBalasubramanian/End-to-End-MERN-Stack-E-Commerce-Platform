import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();
router.route("/").post(protect, placeOrder).get(protect, adminOnly, getAllOrders);
router.get("/my-orders", protect, getMyOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;