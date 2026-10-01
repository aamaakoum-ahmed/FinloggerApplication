import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { month, handleMonthChange } = useAppContext();

  return (
    <div className="header">
      <div className="container">
        <Row className="align-items-center">
          <Col md={6}>
            <div className="title">FinLogger</div>
          </Col>
          <Col md={6}>
            <div className="tagline">Your financial diary</div>
            <Form.Control
              type="month"
              id="monthFilter"
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Header;