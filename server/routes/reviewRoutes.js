import express from "express";
import {
  addReview,
  getReviews
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add review (user must login)
router.post("/", protect, addReview);

// Get product reviews
router.get("/:productId", getReviews);

export default router;



