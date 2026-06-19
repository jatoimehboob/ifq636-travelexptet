const Category = require('../models/Category');

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json(category);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get All Categories
const getCategories = async (req, res) => {

  try {

    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.status(200).json(categories);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update Category
const updateCategory = async (req, res) => {

  try {

    const category = await Category.findById(
      req.params.id
    );

    if (!category) {

      return res.status(404).json({
        message: 'Category not found',
      });

    }

    category.name =
      req.body.name || category.name;

    category.description =
      req.body.description ||
      category.description;

    category.status =
      req.body.status ||
      category.status;

    const updatedCategory =
      await category.save();

    res.status(200).json(updatedCategory);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Category
const deleteCategory = async (req, res) => {

  try {

    const category = await Category.findById(
      req.params.id
    );

    if (!category) {

      return res.status(404).json({
        message: 'Category not found',
      });

    }

    await category.deleteOne();

    res.status(200).json({
      message: 'Category deleted successfully',
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};