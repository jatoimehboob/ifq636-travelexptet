const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// IMPORTANT: destructure functions correctly
const {
  createExpense,
  getExpenses,
  deleteExpense
} = require('../controllers/expenseController');

// ------------------------
// ROUTES (ALL FUNCTIONS)
// ------------------------
router.post('/', authMiddleware, createExpense);
router.get('/', authMiddleware, getExpenses);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
