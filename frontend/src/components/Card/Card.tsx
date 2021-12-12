import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import type { CardData } from '@store/kanban';
import { getSiblingCards } from '@store/kanban';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableTypes } from '@constants';
import { useDispatch } from '@store/dispatch';
import { getItemOrder } from '@utils/getItemOrder';
import { debounce } from 'lodash';
import { store } from '@store';
import { onDragHover } from '@utils/onDragHover';

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
    id, children, color: backgroundColor, order, columnId,
  } = props;

  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const syncCardsCallback = useCallback(
    debounce(
      (ids: number[], fields: string[]) => dispatch.kanban.syncCards({ ids, fields }),
      1000,
    ),
    [],
  );

  const syncCardText = useCallback((ev: React.FocusEvent<HTMLSpanElement>) => {
    dispatch.kanban.updateCard({ id, text: ev.target.textContent ?? '' });
    syncCardsCallback([id], ['text']);
  }, []);

  const syncCardOrder = useCallback((cardId: number, order: number) => {
    dispatch.kanban.updateCard({ id: cardId, order });
    syncCardsCallback([cardId], ['order']);
  }, []);

  const [, drop] = useDrop({
    accept: DraggableTypes.Card,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover: onDragHover<DragCardItem>(ref, (item) => {
      const [prevCard, nextCard] = getSiblingCards(item.id, id)(store.getState());

      const direction = item.order > order ? 'left' : 'right';
      const newOrder = getItemOrder(...(direction === 'left' ? [prevCard?.order, order] : [order, nextCard?.order]));

      // Time to actually perform the action
      syncCardOrder(item.id, newOrder);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.order = newOrder;
    }),
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.Card,
    item: { id, order, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    isDragging: (monitor) => id === monitor.getItem().id,
  }));

  drag(drop(ref));

  return (
    <div ref={ref} className="card cursor-grab p-md shadow-lg" data-id={id} style={{ backgroundColor, opacity: isDragging ? 0.5 : 1 }}>
      <span
        className="card-content"
        onBlur={syncCardText}
        onMouseDown={() => setIsEditing(!isEditing)}
        contentEditable={isEditing}
        suppressContentEditableWarning
      >
        {children}
        <br />
        order:
        {order}
      </span>
    </div>
  );
};

Card.displayName = 'Card';
