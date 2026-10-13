import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ExpenseModal from '../../components/ExpenseModal';
import { useExpenseModal } from '../../context/ExpenseModalContext';
import { useAppContext } from '../../context/AppContext';
import '@testing-library/jest-dom/extend-expect';


jest.mock('../../context/ExpenseModalContext', () => ({
  useExpenseModal: jest.fn()
}));

jest.mock('../../context/AppContext', () => ({
  useAppContext: jest.fn()
}));

describe('ExpenseModal Component', () => {
  const handleCloseMock = jest.fn();
  const showToastMock = jest.fn();
  const fetchExpenseDataMock = jest.fn();

  const expenseCategoriesMock = {
    categories: ['Groceries', 'Rent', 'Utilities']
  };

  beforeEach(() => {
    useExpenseModal.mockReturnValue({
      showModal: true,
      modalMode: 'add',
      modalData: {},
      handleClose: handleCloseMock
    });

    useAppContext.mockReturnValue({
      fetchExpenseData: fetchExpenseDataMock,
      expenseCategories: expenseCategoriesMock,
      showToast: showToastMock
    });

    fetch = jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );
  });
  
  test('shows validation errors if form is submitted with empty fields', async () => {
    render(<ExpenseModal />);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Please provide a valid date.')).toBeInTheDocument();
      expect(screen.getByText('Please select a category.')).toBeInTheDocument();
      expect(screen.getByText('Please provide a description.')).toBeInTheDocument();
      expect(screen.getByText('Please provide an amount.')).toBeInTheDocument();
    });
  });
  
  test('submits the form correctly and makes an API call', async () => {    
    render(<ExpenseModal />);

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2021-07-20' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Milk and Eggs' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '10' } });

    
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'USER_1',
          description: 'Milk and Eggs',
          amount: 10,
          date: '2021-07-20',
          categoryName: 'Groceries'
        })
      });
    });
    
    expect(showToastMock).toHaveBeenCalledWith('Expense submitted successfully!');
    expect(fetchExpenseDataMock).toHaveBeenCalled();
    expect(handleCloseMock).toHaveBeenCalled(); // Ensure modal is closed after submission
  });
});