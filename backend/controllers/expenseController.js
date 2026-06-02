const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {

  try {

  const expense = await Expense.create({
  ...req.body,
  user: req.user.id,
});

    res.status(201).json(expense);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

exports.getExpenses = async (req, res) => {

  try {

   const expenses = await Expense.find({
  user: req.user.id,
}).sort({ date: -1 });

    res.json(expenses);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

exports.updateExpense = async (req, res) => {

  try {

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(expense);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

exports.deleteExpense = async (req, res) => {

  try {

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};