import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Overview from './components/Overview';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseDetails from './components/ExpenseDetails';
import ExpenseModal from './components/ExpenseModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

function Dashboard() {
  const {
    expenseIdToBeDeleted,
    setExpenseIdToBeDeleted,
    fetchExpenseData,
    showToast
  } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalData, setModalData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAdd = () => {
    setModalMode('add');
    setModalData(null);
    setShowModal(true);
  };

  const handleEdit = (expense) => {
    setModalMode('edit');
    setModalData(expense);
    setShowModal(true);
  };

  const handleDeleteConfirm = (id) => {
    setExpenseIdToBeDeleted(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/expenses/${expenseIdToBeDeleted}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Erreur');

      showToast('Expense deleted successfully!');
      await fetchExpenseData();
    } catch (error) {
      showToast('Error deleting expense!');
    }
    setExpenseIdToBeDeleted(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="container">
      <Overview />

      <div className="d-flex justify-content-end mb-2">
        <Button variant="primary" onClick={handleAdd}>
          Add Expense
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <ExpenseSummary />
        </Col>
        <Col md={8}>
          <ExpenseDetails onEdit={handleEdit} onDeleteConfirm={handleDeleteConfirm} />
        </Col>
      </Row>

      <ExpenseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        modalMode={modalMode}
        modalData={modalData}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Header />
      <Dashboard />
    </AppProvider>
  );
}