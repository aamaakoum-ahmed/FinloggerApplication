import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true }
  },
  { collection: 'expense_categories' }
);

const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

export default ExpenseCategory;