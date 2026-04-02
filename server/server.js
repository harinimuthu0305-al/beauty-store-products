import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns/promises";
import path from "path";
import morgan from "morgan";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import liveProductsRouter from "./routes/liveProductsRoutes.js";

// Load environment variables
dotenv.config();

// Fix MongoDB DNS issue
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Connect to database
connectDB();

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://beauty-store-products.vercel.app",
    "https://beauty-store-products-iigbrpzxb-harinimuthu0305-als-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/live-products", liveProductsRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Beauty Product API is running...");
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

// Server Port
const PORT = process.env.PORT || 4000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});