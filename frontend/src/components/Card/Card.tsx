import * as React from 'react';
import { CardData } from '@store/kanban';
import { useDrag } from 'react-dnd';
import { DraggableTypes } from '@constants';
import { useDispatch } from '@store/dispatch';
import { useCallback, useState } from 'react';

import './Card.css';

export interface CardProps extends CardData {
  children: string,
  color: string,
}

export interface DragCardItem {
  id: number,
  columnId: number,
  order: number,
}

export const Card = (props: CardProps) => {
  const {
    id, children, color: backgroundColor,
  } = props;

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const syncCard = useCallback((ev: React.FocusEvent<HTMLSpanElement>) => {
    dispatch.kanban.updateCard({ id, text: ev.target.textContent ?? '' });
    dispatch.kanban.syncCards({ ids: [id], fields: ['text'] });
  }, []);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.Card,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    isDragging: (monitor) => id === monitor.getItem().id,
  }));

  return (
    <div ref={drag} className="card cursor-grab p-md shadow-lg" style={{ backgroundColor, opacity: isDragging ? 0.5 : 1 }}>
      <span
        className="card-content"
        onBlur={syncCard}
        onMouseDown={() => setIsEditing(!isEditing)}
        contentEditable={isEditing}
        suppressContentEditableWarning
      >
        {children}
      </span>
    </div>
  );
};

Card.displayName = 'Card';
