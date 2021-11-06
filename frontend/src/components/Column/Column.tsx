import * as React from 'react';
import { useMemo, useRef } from 'react';
import { Card } from '@components/Card';
import { ColumnData, getCards } from '@store/kanban';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Fab } from '@components/Fab';
import { Button } from '@components/Button';
import { useDispatch } from '@store/dispatch';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableTypes } from '@constants';
import { DragCardItem } from '@components/Card/Card';
import { useSelector } from 'react-redux';
import { debounce, sortBy } from 'lodash';

import './Column.css';

export interface DragColumnItem {
  id: number,
  order: number,
}

export const Column = (props: ColumnData) => {
  const {
    id, order, color: backgroundColor, title,
  } = props;

  const dispatch = useDispatch();

  const cards = useSelector(getCards(id));

  const ref = useRef<HTMLDivElement>(null);

  const syncCards = useMemo(() => debounce((cardId) => dispatch.kanban.syncCards({ ids: [cardId], fields: ['columnId'] }), 2_000), []);

  const [{ handlerId: cardHandlerId }, dropCard] = useDrop({
    accept: DraggableTypes.Card,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragCardItem) {
      if (!ref.current) {
        return;
      }
      const dragColumnId = item.columnId;
      const hoverColumnId = id;

      // Don't replace items with themselves
      if (dragColumnId === hoverColumnId) {
        return;
      }

      // Time to actually perform the action
      dispatch.kanban.updateCard({ id: item.id, columnId: hoverColumnId });
      syncCards(item.id);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.columnId = hoverColumnId;
    },
  });

  const [{ handlerId }, drop] = useDrop({
    accept: DraggableTypes.Column,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragColumnItem) {
      if (!ref.current) {
        return;
      }
      const dragOrder = item.order;
      // Don't replace items with themselves
      if (dragOrder === order) {
        return;
      }

      // Time to actually perform the action
      dispatch.kanban.updateColumn({ id: item.id, order });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.order = order;
    },
  });

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: DraggableTypes.Column,
    item: { id, order },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  drag(drop(ref));

  // use #rrggbbaa hex format
  const transparentizedColor = `${backgroundColor}64`;

  const handleCardCreate = () => dispatch.kanban.createCard({
    text: 'New card',
    order: 1,
    columnId: id,
  });

  return (
    <div ref={dragPreview} className="w-full" style={{ opacity: isDragging ? 0.5 : 1 }} data-handler-id={handlerId}>
      <div ref={ref} style={{ backgroundColor }} className="cursor-grab flex flex-row p-md mb-xsm text-white text-2xl items-center font-semibold">
        {title}
        <Fab className="ml-auto hover:bg-[#ffffff48]">
          <FontAwesomeIcon icon={faTimes} />
        </Fab>
      </div>
      <div ref={dropCard} style={{ backgroundColor: transparentizedColor }} className="h-full column-content p-md" data-handler-id={cardHandlerId}>
        <Button onClick={handleCardCreate} className="bg-[#ffffff64] w-full justify-center mb-md hover:bg-[#ffffffb0]">
          Add new card
          <FontAwesomeIcon icon={faPlus} className="ml-sm" />
        </Button>
        <div className="flex flex-wrap gap-md items-start">
          {sortBy(cards, ['order']).map((card) => (
            <Card key={card.id} color={transparentizedColor} {...card}>
              {card.text}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

Column.displayName = 'Column';
