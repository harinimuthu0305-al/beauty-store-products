import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Create Order (Logged-in User)
router.post("/", protect, createOrder);

// ✅ Get Logged-in User Orders
router.get("/myorders", protect, getMyOrders);

// ✅ Get All Orders (Admin Only)
router.get("/", protect, admin, getOrders);

// ✅ Get Single Order by ID
router.get("/:id", protect, getOrderById);

// ✅ Update Order Status (Admin Only)
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;