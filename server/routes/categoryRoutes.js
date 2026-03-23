import express from "express";
import {
  getCategories,
  addCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

// Get categories
router.get("/", getCategories);

// Add category
router.post("/", addCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;
