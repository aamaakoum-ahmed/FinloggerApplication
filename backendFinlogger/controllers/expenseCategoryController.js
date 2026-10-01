import ExpenseCategory from '../models/expenseCategory.js';

// GET /expenses/categories
export const getAllExpenseCategories = (req, res) => {
  ExpenseCategory.find({}, 'name')
    .then((categories) => {
      const names = categories.map((cat) => cat.name);
      return res.status(200).json({ categories: names });
    })
    .catch(() => {
      return res.status(500).json({ error: 'Server error.' });
    });
};