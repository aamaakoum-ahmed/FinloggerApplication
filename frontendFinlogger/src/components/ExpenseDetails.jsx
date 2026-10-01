import React from 'react';
import { useAppContext } from '../context/AppContext';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';

const ExpenseDetails = ({ onEdit, onDeleteConfirm }) => {
  const { expenseDetailsData } = useAppContext();

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  return (
    <div className="tbl-container">
      <h4 className="heading">Expense Details</h4>
      <table className="table" id="expenseTable">
        <thead>
          <tr>
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>AMOUNT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenseDetailsData.map((exp) => (
            <tr key={exp._id}>
              <td>{formatDate(exp.date)}</td>
              <td>{exp.description}</td>
              <td>${exp.amount}</td>
              <td>
                <span
                  className="edit me-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onEdit(exp)}
                >
                  <img src={editIcon} alt="edit" />
                </span>
                <span
                  className="delete"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onDeleteConfirm(exp._id)}
                >
                  <img src={deleteIcon} alt="delete" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseDetails;