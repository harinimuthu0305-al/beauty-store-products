import Product from "../models/Product.js";
import { cloudinary } from "../utils/cloudinary.js";

// Helper — upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "beauty-store-products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add product
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, countInStock, brand } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // Upload image buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const product = new Product({
      name,
      price,
      category,
      description,
      countInStock,
      brand,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, countInStock, brand } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image uploaded, delete old and upload new
    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      product.image = result.secure_url;
      product.imagePublicId = result.public_id;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.countInStock = countInStock ?? product.countInStock;
    product.brand = brand || product.brand;

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};