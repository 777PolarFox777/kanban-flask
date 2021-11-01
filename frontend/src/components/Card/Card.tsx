import * as React from 'react';
import { CardData } from '@store/kanban';

import './Card.css';

export interface CardProps extends CardData {
  children: string,
  color: string,
}

export interface DragCardItem {
  id: number,
  order: number,
}

export const Card = (props: CardProps) => {
  const {
    children, color: backgroundColor,
  } = props;

  return (
    <div className="card p-md shadow-lg" style={{ backgroundColor }}>
      <span className="card-content">
        {children}
      </span>
    </div>
  );
};

Card.displayName = 'Card';
