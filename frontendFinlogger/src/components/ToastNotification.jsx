import React from 'react';
import { Toast } from 'react-bootstrap';

const ToastNotification = ({ show, message, onClose }) => {
  return (
    <Toast
      show={show}
      onClose={onClose}
      delay={3000}
      autohide
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: '#d4edda',
        color: '#155724'
      }}
    >
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastNotification;