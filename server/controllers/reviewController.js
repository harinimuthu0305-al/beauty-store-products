import Review from "../models/Review.js";
import mongoose from "mongoose";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const review = new Review({
      product: mongoose.Types.ObjectId.isValid(productId)
        ? productId
        : new mongoose.Types.ObjectId(),
      productRef: productId,  // store original id (works for live products too)
      user: req.user._id,
      rating,
      comment,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Reviews for Product
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Search by both MongoDB id and productRef
    const reviews = await Review.find({
      $or: [
        { productRef: productId },
        ...(mongoose.Types.ObjectId.isValid(productId)
          ? [{ product: productId }]
          : [])
      ]
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};