const Expense = require('../models/Expense');

/**
 * CREATE EXPENSE
 */
const createExpense = async (req, res) => {
  try {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized - No user found'
      });
    }

    const { title, amount, category } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        message: 'Title and amount are required'
      });
    }

    const expense = new Expense({
      title,
      amount,
      category: category || null,
      user: userId
    });

    const savedExpense = await expense.save();

    return res.status(201).json(savedExpense);

  } catch (error) {
    console.error('Create Expense Error:', error);

    return res.status(500).json({
      message: 'Server error while creating expense'
    });
  }
};

/**
 * GET EXPENSES
 */
const getExpenses = async (req, res) => {
  try {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const expenses = await Expense.find({ user: userId });

    return res.status(200).json(expenses);

  } catch (error) {
    console.error('Get Expenses Error:', error);

    return res.status(500).json({
      message: 'Server error while fetching expenses'
    });
  }
};

/**
 * DELETE EXPENSE
 */
const deleteExpense = async (req, res) => {
  try {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    if (!expense) {
      return res.status(404).json({
        message: 'Expense not found'
      });
    }

    return res.status(200).json({
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete Expense Error:', error);

    return res.status(500).json({
      message: 'Server error while deleting expense'
    });
  }
};

/**
 * EXPORTS (VERY IMPORTANT)
 */
module.exports = {
  createExpense,
  getExpenses,
  deleteExpense
};
