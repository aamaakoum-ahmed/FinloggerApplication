import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';

const ExpenseModal = ({ show, handleClose, modalMode, modalData }) => {
  const { expenseCategories, fetchExpenseData, showToast } = useAppContext();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    categoryName: ''
  });

  useEffect(() => {
    if (modalData) {
      setFormData({
        description: modalData.description || '',
        amount: modalData.amount || '',
        date: modalData.date ? modalData.date.split('T')[0] : '',
        categoryName: modalData.categoryName || ''
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        date: '',
        categoryName: ''
      });
    }
  }, [modalData, show]);

  const handleSubmit = async () => {
    const payload = {
      user_id: 'USER_1',
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      categoryName: formData.categoryName
    };

    const apiURL =
      modalMode === 'add'
        ? 'http://localhost:3001/expenses'
        : `http://localhost:3001/expenses/${modalData._id}`;

    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(apiURL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erreur lors de la soumission');

      showToast(
        modalMode === 'add'
          ? 'Expense submitted successfully!'
          : 'Expense saved successfully!'
      );
      await fetchExpenseData();
      handleClose();
    } catch (error) {
      showToast('Erreur lors de la soumission');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalMode === 'add' ? 'Add Expense' : 'Edit Expense'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="expenseForm">
          <Form.Group className="form-group mb-2">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="form-group mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
            >
              <option value="">Select a category...</option>
              {expenseCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="form-group mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="form-group mb-2">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {modalMode === 'add' ? 'Submit' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseModal;