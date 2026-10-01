import mongoose from 'mongoose';
import Expense from '../models/expense.js';
import ExpenseCategory from '../models/expenseCategory.js';


// Create expense  - POST /expenses

export const createExpense = (req, res) => {
  const { user_id, description, amount, date, categoryName } = req.body;

  ExpenseCategory.findOne({ name: categoryName })
    .then((category) => {
      if (!category) {
        return res.status(400).json({ error: 'Category not found.' });
      }

      return Expense.create({
        user_id,
        description,
        amount,
        date,
        category_id: category._id
      }).then((expense) => {
        if (expense) {
          return res.status(201).json({
            id: expense._id,
            message: 'Expense created successfully.'
          });
        }
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(400)
          .json({ message: 'Validation failed.', details: error.errors });
      }
      return res.status(500).json({ error: 'Server error.' });
    });
};


// Update expense - PUT /expenses/:id

export const updateExpense = (req, res) => {
  const { id } = req.params;
  const { description, amount, date, categoryName } = req.body;

  ExpenseCategory.findOne({ name: categoryName })
    .then((category) => {
      if (!category) {
        return res.status(400).json({ error: 'Category not found.' });
      }

      return Expense.findByIdAndUpdate(
        id,
        { description, amount, date, category_id: category._id },
        { new: true }
      ).then((updatedExpense) => {
        if (!updatedExpense) {
          return res.status(404).json({ error: 'Expense not found.' });
        }
        return res.status(200).json({ message: 'Expense updated successfully.' });
      });
    })
    .catch(() => {
      return res.status(500).json({ error: 'Server error.' });
    });
};

// Delete expense - DELETE /expenses/:id

export const deleteExpense = (req, res) => {
  const { id } = req.params;

  Expense.findByIdAndDelete(id)
    .then((deletedExpense) => {
      if (!deletedExpense) {
        return res.status(404).json({ error: 'Expense not found.' });
      }
      return res.status(200).json({
        message: 'Expense deleted successfully.',
        deletedExpense
      });
    })
    .catch(() => {
      return res.status(500).json({ error: 'Server error.' });
    });
};

// Get expense - GET /expenses?userId=...&month=...

export const getExpenses = (req, res) => {
  const { userId, month } = req.query;

  let dateFilter = {};
  if (month) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
    dateFilter = { date: { $gte: startDate, $lte: endDate } };
  }

  const userFilter = { user_id: userId };

  Expense.aggregate([
    { $match: { ...dateFilter, ...userFilter } },
    {
      $lookup: {
        from: 'expense_categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 1,
        description: 1,
        amount: 1,
        date: 1,
        categoryName: '$category.name'
      }
    }
  ])
    .sort({ date: -1 })
    .then((expenses) => {
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      return res.status(200).json({ totalExpenses, expenses });
    })
    .catch(() => {
      return res.status(500).json({ error: 'Server error.' });
    });
};

// GET EXPENSE SUMMARY - GET /expenses/summary?userId=...&month=...

export const getExpenseSummary = (req, res) => {
  const { userId, month } = req.query;

  let dateFilter = {};
  if (month) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
    dateFilter = { date: { $gte: startDate, $lte: endDate } };
  }

  const userFilter = { user_id: userId };

  Expense.aggregate([
    { $match: { ...dateFilter, ...userFilter } },
    {
      $lookup: {
        from: 'expense_categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category._id',
        categoryName: { $first: '$category.name' },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: '$totalAmount' },
        categories: {
          $push: {
            categoryName: '$categoryName',
            totalAmount: '$totalAmount'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        categories: {
          $map: {
            input: '$categories',
            as: 'cat',
            in: {
              categoryName: '$$cat.categoryName',
              percentage: {
                $concat: [
                  {
                    $toString: {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ['$$cat.totalAmount', '$totalExpense'] },
                            100
                          ]
                        },
                        2
                      ]
                    }
                  },
                  '%'
                ]
              }
            }
          }
        }
      }
    },
    { $unwind: '$categories' },
    { $replaceRoot: { newRoot: '$categories' } }
  ])
    .sort({ categoryName: 1 })
    .then((summary) => {
      return res.status(200).json(summary);
    })
    .catch(() => {
      return res.status(500).json({ error: 'Server error.' });
    });
};