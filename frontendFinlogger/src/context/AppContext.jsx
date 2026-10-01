import React, { createContext, useState, useContext, useEffect } from 'react';
import ToastNotification from '../components/ToastNotification';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [month, setMonth] = useState('2020-01');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseDetailsData, setExpenseDetailsData] = useState([]);
  const [expenseSummaryData, setExpenseSummaryData] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenseIdToBeDeleted, setExpenseIdToBeDeleted] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => setToast({ show: true, message });
  const hideToast = () => setToast({ show: false, message: '' });

  const fetchExpenseCategories = async () => {
    try {
      const res = await fetch('http://localhost:3001/expenses/categories');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setExpenseCategories(data.categories);
    } catch (error) {
      showToast('Erreur lors du chargement des catégories');
    }
  };

  const fetchExpenseData = async () => {
    try {
      const [detailsRes, summaryRes] = await Promise.all([
        fetch(`http://localhost:3001/expenses?userId=USER_1&month=${month}`),
        fetch(`http://localhost:3001/expenses/summary?userId=USER_1&month=${month}`)
      ]);
      if (!detailsRes.ok || !summaryRes.ok) throw new Error('Erreur de chargement');

      const detailsData = await detailsRes.json();
      const summaryData = await summaryRes.json();

      setExpenseDetailsData(detailsData.expenses);
      setTotalExpenses(detailsData.totalExpenses);
      setExpenseSummaryData(summaryData);
    } catch (error) {
      showToast('Erreur lors du chargement des depenses');
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
    fetchExpenseData();
  }, [month]);

  const handleMonthChange = (newMonth) => setMonth(newMonth);

  return (
    <AppContext.Provider
      value={{
        month,
        totalExpenses,
        expenseDetailsData,
        expenseSummaryData,
        expenseCategories,
        expenseIdToBeDeleted,
        setExpenseIdToBeDeleted,
        fetchExpenseData,
        showToast,
        handleMonthChange
      }}
    >
      {children}
      <ToastNotification show={toast.show} message={toast.message} onClose={hideToast} />
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);