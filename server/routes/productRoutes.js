import { Router } from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/categories", getCategories);
router.route("/").get(getProducts).post(protect, adminOnly, createProduct);
router.route("/:id").get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);

export default router;