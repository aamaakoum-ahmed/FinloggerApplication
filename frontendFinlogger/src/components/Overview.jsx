import React from 'react';
import { Row, Col } from 'react-bootstrap';
import OverviewCard from './OverviewCard';
import { useAppContext } from '../context/AppContext';
import expenseIcon from '../assets/expenses.svg';
import incomeIcon from '../assets/income.svg';
import balanceIcon from '../assets/balance.svg';

const Overview = () => {
  const { totalExpenses } = useAppContext();
  const monthlyIncome = 1400;
  const balance = monthlyIncome - totalExpenses;

  return (
    <div className="main-container">
      <h4 className="overview-hd">OVERVIEW</h4>
      <Row>
        <Col md={4}>
          <OverviewCard icon={expenseIcon} label="Expenses" value={`$${totalExpenses}`} />
        </Col>
        <Col md={4}>
          <OverviewCard icon={incomeIcon} label="Monthly Income" value={`$${monthlyIncome}`} />
        </Col>
        <Col md={4}>
          <OverviewCard icon={balanceIcon} label="Balance" value={`$${balance}`} />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;