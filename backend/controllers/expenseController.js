const Expense = require("../models/Expense");

/**
 * CREATE EXPENSE
 */
const createExpense = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expense = await Expense.create({
      ...req.body,
      user: req.user._id
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("Create Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL EXPENSES (USER ONLY)
 */
const getExpenses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expenses = await Expense.find({ user: req.user._id });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE EXPENSE
 */
const updateExpense = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error("Update Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE EXPENSE (🔥 FIX FOR YOUR 500 ERROR)
 */
const deleteExpense = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Expense deleted successfully"
    });

  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
