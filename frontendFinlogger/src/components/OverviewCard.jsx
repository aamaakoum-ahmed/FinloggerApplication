import React from 'react';
import { Card } from 'react-bootstrap';

const OverviewCard = ({ icon, label, value }) => {
  return (
    <Card className="p-3">
      <div className="d-flex align-items-center">
        <img src={icon} alt={label} />
        <div>
          <h5>{label}</h5>
          <p>{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default OverviewCard;