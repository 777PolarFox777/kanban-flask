import * as React from 'react';
import { Card } from '@components/Card';
import { ColumnData } from '@store/kanban';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Fab } from '@components/Fab';
import { Button } from '@components/Button';
import { useDispatch } from '@store/dispatch';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableTypes } from '@constants';
import { useRef } from 'react';
import { DragCardItem } from '@components/Card/Card';

import './Column.css';

export const Column = (props: ColumnData) => {
  const {
    id, order, color: backgroundColor, title, cards,
  } = props;

  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: DraggableTypes.Column,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragCardItem) {
      if (!ref.current) {
        return;
      }
      const dragOrder = item.order;
      const hoverOrder = order;

      // Don't replace items with themselves
      if (dragOrder === hoverOrder) {
        return;
      }

      // Time to actually perform the action
      dispatch.kanban.updateColumn({ id: item.id, order });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.order = hoverOrder;
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
      <div style={{ backgroundColor: transparentizedColor }} className="h-full column-content p-md">
        <Button onClick={handleCardCreate} className="bg-[#ffffff64] w-full justify-center mb-md hover:bg-[#ffffffb0]">
          Add new card
          <FontAwesomeIcon icon={faPlus} className="ml-sm" />
        </Button>
        <div className="flex flex-wrap gap-md items-start">
          {cards.map((card) => (
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
