import * as React from 'react';
import { CardData } from '@store/kanban';
import { useDrag } from 'react-dnd';
import { DraggableTypes } from '@constants';

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
    id, children, color: backgroundColor,
  } = props;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.Card,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div ref={drag} className="card cursor-grab p-md shadow-lg" style={{ backgroundColor, opacity: isDragging ? 0.5 : 1 }}>
      <span className="card-content" contentEditable onInput={(ev) => console.debug('ev', ev)}>
        {children}
      </span>
    </div>
  );
};

Card.displayName = 'Card';
