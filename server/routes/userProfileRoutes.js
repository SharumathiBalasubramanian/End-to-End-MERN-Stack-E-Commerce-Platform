import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userProfile.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.route("/me").get(protect, getProfile).put(protect, updateProfile);

export default router;