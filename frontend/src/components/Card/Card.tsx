import * as React from 'react';

import './Card.css';

export interface CardProps {
  children: string,
  color: string,
}

export const Card = (props: CardProps) => {
  const { children, color: backgroundColor } = props;

  return (
    <div className="card p-md shadow-lg" style={{ backgroundColor }}>
      <span className="card-content">
        {children}
      </span>
    </div>
  );
};

Card.displayName = 'Card';
