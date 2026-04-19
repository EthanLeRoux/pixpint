import React from 'react';
import IllustrationCard from './IllustrationCard';
import './IllustrationGrid.css';

const IllustrationGrid = ({ illustrations }) => {
  return (
    <div className="illustration-grid">
      {illustrations.map((item) => (
        <IllustrationCard key={item.id} illustration={item} />
      ))}
    </div>
  );
};

export default IllustrationGrid;
