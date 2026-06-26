const express = require("express");

const {
  createExpense,
  getExpenses,
  deleteExpense
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", protect, createExpense);

// GET ALL
router.get("/", protect, getExpenses);

// DELETE
router.delete("/:id", protect, deleteExpense);

module.exports = router;
