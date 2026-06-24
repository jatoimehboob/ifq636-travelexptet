const Expense = require("../models/Expense");
const ExpenseService = require("../designpatterns/facade/ExpenseService");

// FACADE: the controller no longer orchestrates validate -> save -> notify
// itself. It hands the work to ExpenseService, which also publishes an
// EXPENSE_ADDED event through the Observer (NotificationCenter).
const expenseService = new ExpenseService();

exports.addExpense = async (req, res) => {

  try {

    const expense = await expenseService.addExpense(req.body, req.user.id);

    res.status(201).json(expense);

  } catch (error) {

    console.log(error);

    // Validation errors from the Facade are client errors (400), not 500.
    const isValidation = /Missing required field|greater than zero/.test(error.message);

    res.status(isValidation ? 400 : 500).json({
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