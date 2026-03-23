import Category from "../models/Category.js";

// Get all categories
export const getCategories = async (req, res) => {

  const categories = await Category.find();

  res.json(categories);

};

// Add category
export const addCategory = async (req, res) => {

  const { name } = req.body;

  const category = new Category({ name });

  const createdCategory = await category.save();

  res.status(201).json(createdCategory);

};

// Delete category
export const deleteCategory = async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (category) {

    await category.deleteOne();

    res.json({ message: "Category deleted" });

  } else {

    res.status(404).json({ message: "Category not found" });

  }

};
