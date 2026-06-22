const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    const { title, amount, category, paymentMethod, date, description } = req.body;

    if (!title || !amount || !category || !paymentMethod || !date) {
      return res.status(400).json({
        message: 'Title, amount, category, payment method, and date are required'
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      paymentMethod,
      date,
      description,
      user: userId
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error('Create Expense Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Get Expenses Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error('Update Expense Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
