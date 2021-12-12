import * as React from 'react';
import { useMemo, useRef } from 'react';
import { Card } from '@components/Card';
import type { ColumnData } from '@store/kanban';
import { getCards, getSiblingColumns } from '@store/kanban';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Fab } from '@components/Fab';
import { Button } from '@components/Button';
import { useDispatch } from '@store/dispatch';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableTypes } from '@constants';
import type { DragCardItem } from '@components/Card/Card';
import { useSelector } from 'react-redux';
import { debounce, sortBy } from 'lodash';
import { onDragHover } from '@utils/onDragHover';
import { store } from '@store';
import { getItemOrder } from '@utils/getItemOrder';

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

  const ref = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const syncCards = useMemo(() => debounce((cardId) => dispatch.kanban.syncCards({ ids: [cardId], fields: ['columnId', 'order'] }), 2_000), []);

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

      const newOrder = cards.length ? Math.max(...cards.map((card) => card.order)) + 1 : 100;
      // Time to actually perform the action
      dispatch.kanban.updateCard({ id: item.id, columnId: hoverColumnId, order: newOrder });
      syncCards(item.id);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.columnId = hoverColumnId;
      item.order = newOrder;
    },
  });

  const [{ handlerId }, drop] = useDrop({
    accept: DraggableTypes.Column,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover: onDragHover<DragColumnItem>(wrapperRef, (item) => {
      const [prevCol, nextCol] = getSiblingColumns(id)(store.getState());

      const direction = item.order > order ? 'left' : 'right';
      const newOrder = getItemOrder(...(direction === 'left' ? [prevCol?.order, order] : [order, nextCol?.order]));
      // Time to actually perform the action
      dispatch.kanban.updateColumn({ id: item.id, order: newOrder });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.order = newOrder;
    }),
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
  dragPreview(wrapperRef);

  // use #rrggbbaa hex format
  const transparentizedColor = `${backgroundColor}64`;

  const handleCardCreate = () => dispatch.kanban.createCard({
    text: 'New card',
    order: cards.length ? Math.max(...cards.map((card) => card.order)) + 1 : 100,
    columnId: id,
  });

  return (
    <div ref={wrapperRef} className="w-full" data-id={id} style={{ opacity: isDragging ? 0.5 : 1 }} data-handler-id={handlerId}>
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
