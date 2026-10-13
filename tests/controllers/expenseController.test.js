import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses
} from '../backendFinlogger/controllers/expenseController.js';
import Expense from '../backendFinlogger/models/expense.js';
import ExpenseCategory from '../backendFinlogger/models/ExpenseCategory.js';


const app = express();
app.use(express.json());

app.post('/expenses', createExpense);         // Creer une depense
app.put('/expenses/:id', updateExpense);      // Mettre a jour une depense
app.delete('/expenses/:id', deleteExpense);   // Supprimer une depense
app.get('/expenses', getExpenses);            // Recuperer les depenses
app.get('/expense-summary', getExpenseSummary);  // Recuperer la somme

describe('Expense Controller', () => {
 
  describe('POST /expenses Create Expense', () => {

    it('should create an expense', async () => {
      // ---------- ARRANGE ----------      
      await ExpenseCategory.create({
        _id: 'EDUCATION',
        name: 'Education'
      });      
      const newExpense = {
        user_id: 'USER_2',
        description: 'Fees',
        amount: 70,
        date: '2020-07-08',
        categoryName: 'Education'
      };

      // ---------- ACT ----------      
      const response = await request(app)
        .post('/expenses')
        .send(newExpense);

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(201);      
      expect(response.body).to.have.property('id');
      expect(response.body.id).to.be.a('string');
    
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Expense created successfully.');
      
      const savedExpense = await Expense.findById(response.body.id);
      expect(savedExpense).to.not.be.null;
      expect(savedExpense.user_id).to.equal('USER_2');
      expect(savedExpense.description).to.equal('Fees');
      expect(savedExpense.amount).to.equal(70);
      expect(savedExpense.category_id).to.equal('EDUCATION');
    });

    it('should return 400 if required validation fails', async () => {
      // ---------- ARRANGE ----------      
      await ExpenseCategory.create({ _id: 'HOUSING', name: 'Housing' });
      
      const invalidExpense = {
        user_id: 'USER_2',
        amount: 100,
        date: '2020-07-01',
        categoryName: 'Housing'        
      };
      // ---------- ACT ----------  

      const response = await request(app)
        .post('/expenses')
        .send(invalidExpense);

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(400);
      
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Validation failed.');
      
      expect(response.body).to.have.property('details');
      expect(response.body.details).to.have.property('description');
      expect(response.body.details.description.kind).to.equal('required');
      
      const count = await Expense.countDocuments();
      expect(count).to.equal(0);
    });

  });
  describe('PUT /expenses/:id Update Expense', () => {
    
    it('should update an expense', async () => {
      // ---------- ARRANGE ----------
      
      await ExpenseCategory.create({ _id: 'TRANSPORT', name: 'Transport' });
      
      const expense = await Expense.create({
        user_id: 'USER_2',
        description: 'Bus',
        amount: 5,
        date: '2020-07-08',
        category_id: 'TRANSPORT'
      });
      
      const updatedData = {
        description: 'Train',
        amount: 15,
        date: '2020-07-09',
        categoryName: 'Transport'
      };

      // ---------- ACT ----------      
      const response = await request(app)
        .put(`/expenses/${expense._id}`)
        .send(updatedData);

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(200);
     
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Expense updated successfully.');
      
      const updatedExpense = await Expense.findById(expense._id);
      expect(updatedExpense).to.not.be.null;
      expect(updatedExpense.description).to.equal('Train');
      expect(updatedExpense.amount).to.equal(15);
      expect(updatedExpense.category_id).to.equal('TRANSPORT');
    });

    it('should return 404 if the expense to be updated is not found', async () => {
      // ---------- ARRANGE ----------      
      await ExpenseCategory.create({ _id: 'TRANSPORT', name: 'Transport' });
      
      const nonExistentId = '60c72b2f9b1e8c4f8c56ab45';
      const updatedData = {
        description: 'Train',
        amount: 15,
        date: '2020-07-09',
        categoryName: 'Transport'
      };

      // ---------- ACT ----------     
      const response = await request(app)
        .put(`/expenses/${nonExistentId}`)
        .send(updatedData);

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(404);      
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Expense not found.');      
      const count = await Expense.countDocuments();
      expect(count).to.equal(0);
    }); 


  });

  describe('DELETE /expenses/:id — Delete Expense', () => {
    
    it('should delete an expense', async () => {
      // ---------- ARRANGE ----------      
      await ExpenseCategory.create({
        _id: 'ENTERTAINMENT',
        name: 'Entertainment'
      });

      const expense = await Expense.create({
        user_id: 'USER_2',
        description: 'Movie',
        amount: 30,
        date: '2020-06-12',
        category_id: 'ENTERTAINMENT'
      });
      
      const beforeDelete = await Expense.findById(expense._id);
      expect(beforeDelete).to.not.be.null;

      // ---------- ACT ----------      
      const response = await request(app)
        .delete(`/expenses/${expense._id}`);

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(200);      
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Expense deleted successfully.');     
      const afterDelete = await Expense.findById(expense._id);
      expect(afterDelete).to.be.null;

      const count = await Expense.countDocuments();
      expect(count).to.equal(0);
    });

  });

   describe('GET /expenses Get Expenses', () => {
    
    it('should fetch expense details', async () => {
      // ---------- ARRANGE ----------      
      await ExpenseCategory.create({
        _id: 'ENTERTAINMENT',
        name: 'Entertainment'
      });
      
      await Expense.create({
        user_id: 'USER_2',
        description: 'Movie',
        amount: 30,
        date: new Date('2020-06-12'),
        category_id: 'ENTERTAINMENT'
      });

      // ---------- ACT ----------      
      const response = await request(app)
        .get('/expenses')
        .query({ userId: 'USER_2', month: '2020-06' });

      // ---------- ASSERT ----------      
      expect(response.status).to.equal(200);      
      expect(response.body).to.have.property('totalExpenses');
      expect(response.body.totalExpenses).to.be.a('number');
      expect(response.body.totalExpenses).to.equal(30);
      
      expect(response.body).to.have.property('expenses');
      expect(response.body.expenses).to.be.an('array');
      expect(response.body.expenses).to.have.lengthOf(1);
      
      const expense = response.body.expenses[0];
      expect(expense).to.have.property('description');
      expect(expense.description).to.equal('Movie');
      expect(expense.amount).to.equal(30);
      expect(expense.categoryName).to.equal('Entertainment');
    });

  });

});