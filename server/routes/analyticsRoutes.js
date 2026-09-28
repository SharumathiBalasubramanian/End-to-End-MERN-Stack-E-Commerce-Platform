import { Router } from "express";
import { getRecommendations } from "../controllers/analyticsController.js";

const router = Router();
router.get("/recommendations/:productId", getRecommendations);

export default router;