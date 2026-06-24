const Category = require("../models/Category");

// CREATE
const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        return res.status(201).json(category); // MUST return full object with _id

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET ALL
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.status(200).json(category);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};
