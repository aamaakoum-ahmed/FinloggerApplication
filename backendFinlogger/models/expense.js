import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    category_id: { type: String, ref: 'ExpenseCategory', required: true }
  },
  { collection: 'expenses' }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;