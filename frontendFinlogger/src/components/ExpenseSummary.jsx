import React from 'react';
import { useAppContext } from '../context/AppContext';

const ExpenseSummary = () => {
  const { expenseSummaryData } = useAppContext();

  return (
    <div className="tbl-container">
      <h4 className="heading">Expense Summary</h4>
      <table className="table">
        <thead>
          <tr>
            <th>EXPENSE CATEGORY</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {expenseSummaryData.map((item, index) => (
            <tr key={index}>
              <td>{item.categoryName}</td>
              <td>{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseSummary;