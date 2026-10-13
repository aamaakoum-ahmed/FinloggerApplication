/*
    Suites de tests unitaire pour le model expense 
    Utilisation de :
        mocha --> structure 
        chai --> Assertions
        mongoDB Memory Server --> BD isolée
    Chaque test suit le Pattern AAA (arrange - Act - Assert)
*/

import mongoose from 'mongoose';
import { expect } from 'chai';
import Expense from '../../models/expense.js';
import ExpenseCategory from '../../models/expenseCategory.js';
import './../test_helper.js';

// creation d une instance de Expense 
const expense = new Expense({
     user_id: 'USER_2',
     description: 'Lunch',
     amount: 10,
     date: new Date(),
     category_id: category._id
 });

 // Utilisation de save() une methode pour enregistrer expense dans BD
 const savedExpense = await expense.save();
 expect(savedExpense._id).to.exist;
 expect(savedExpense.user_id).to.equal('USER_2');


describe('Expense Model', () => {  
  let categoryId;
  let expenseId;
  
  beforeEach(async () => {
    const category = await ExpenseCategory.create({
      _id: 'CAT_TEST',
      name: 'Test Category'
    });
    categoryId = category._id;
  });
  
  describe('create() Creer une depense', () => {
    it('should create an expense successfully', async () => {
      
      const expenseData = {
        user_id: 'USER_1',
        description: 'Test expense',
        amount: 100,
        date: new Date('2020-01-15'),
        category_id: categoryId
      };
      
      const expense = await Expense.create(expenseData);

      expect(expense).to.be.an('object');
      expect(expense._id).to.exist;
      expect(expense.user_id).to.equal('USER_1');
      expect(expense.description).to.equal('Test expense');
      expect(expense.amount).to.equal(100);
      expect(expense.category_id).to.equal('CAT_TEST');
      expect(expense.date).to.be.a('Date');
      
      const found = await Expense.findById(expense._id);
      expect(found).to.not.be.null;
      expect(found.description).to.equal('Test expense');
    });

    it('should assign a default date if not provided', async () => {
      
      const beforeDate = new Date();      
      const expense = await Expense.create({
        user_id: 'USER_1',
        description: 'No date expense',
        amount: 50,
        category_id: categoryId
      });

      expect(expense.date).to.be.a('Date');
      expect(expense.date.getTime()).to.be.at.least(beforeDate.getTime() - 1000);
    });

    it('should fail validation if required fields are missing', async () => {
      
      const invalidData = {
        user_id: 'USER_1'        
      };
      
      try {
        await Expense.create(invalidData);
        expect.fail('Should have thrown a validation error');
      } catch (error) {
        expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
        expect(error.errors.description).to.exist;
        expect(error.errors.amount).to.exist;
        expect(error.errors.category_id).to.exist;
      }
    });
  });

  
  describe('findByIdAndUpdate() Mettre a jour une depense', () => {
    beforeEach(async () => {      
      const expense = await Expense.create({
        user_id: 'USER_1',
        description: 'Original description',
        amount: 50,
        date: new Date('2020-01-10'),
        category_id: categoryId
      });
      expenseId = expense._id;
    });

    it('should update an expense successfully', async () => {     
      const updateData = {
        description: 'Updated description',
        amount: 75
      };

      const updatedExpense = await Expense.findByIdAndUpdate()
        expenseId,
        updateData,
        { new: true }
      
      expect(updatedExpense).to.not.be.null;
      expect(updatedExpense._id.toString()).to.equal(expenseId.toString());
      expect(updatedExpense.description).to.equal('Updated description');
      expect(updatedExpense.amount).to.equal(75);
      
      const found = await Expense.findById(expenseId);
      expect(found.description).to.equal('Updated description');
    });

    it('should return null when updating a non-existent expense', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();      
      const result = await Expense.findByIdAndUpdate(
        fakeId,
        { description: 'Does not exist' },
        { new: true }
      );
      
      expect(result).to.be.null;
    });
  });
  
  describe('findByIdAndDelete() Supprimer une depense', () => {
    beforeEach(async () => {
      const expense = await Expense.create({
        user_id: 'USER_1',
        description: 'To be deleted',
        amount: 30,
        date: new Date('2020-01-20'),
        category_id: categoryId
      });
      expenseId = expense._id;
    });

    it('should delete an expense successfully', async () => {      
      const countBefore = await Expense.countDocuments();
      expect(countBefore).to.equal(1);
      
      const deletedExpense = await Expense.findByIdAndDelete(expenseId);
      
      expect(deletedExpense).to.not.be.null;
      expect(deletedExpense._id.toString()).to.equal(expenseId.toString());
      expect(deletedExpense.description).to.equal('To be deleted');
      
      const found = await Expense.findById(expenseId);
      expect(found).to.be.null;

      const countAfter = await Expense.countDocuments();
      expect(countAfter).to.equal(0);
    });

    it('should return null when deleting a non-existent expense', async () => {      
      const fakeId = new mongoose.Types.ObjectId();      
      const result = await Expense.findByIdAndDelete(fakeId);      
      expect(result).to.be.null;
    });
  });
});