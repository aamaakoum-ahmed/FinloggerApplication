import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import * as expenseCategoryController from '../controllers/expenseCategoryController.js';

const router = express.Router();

// Routes des depenses
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/', expenseController.getExpenses);
router.get('/summary', expenseController.getExpenseSummary);

// Routes des categories
router.get('/categories', expenseCategoryController.getAllExpenseCategories);

export default router;