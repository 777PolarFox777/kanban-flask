import * as React from 'react';
import { DraggableTypes } from '@constants';
import { useDrop } from 'react-dnd';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from '@store/dispatch';

import './TrashBin.css';

export const TrashBin = () => {
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.Card,
    drop: (item: { id: number}) => {
      dispatch.kanban.removeCard(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div ref={drop} className={cn('trash-bin opacity-0 flex flex-col items-center justify-center rounded-md w-full border-2 border-dashed border-gray-400', !canDrop && 'h-[0]', canDrop && 'opacity-100 h-[5rem] mb-xxl', isActive && 'border-red-400 bg-red-400 bg-opacity-[10%]')}>
      <FontAwesomeIcon className={cn('text-3xl text-gray-400')} icon={faTrash} />
      <div className="text-gray-600">
        Drop cards here to remove them
      </div>
    </div>
  );
};

TrashBin.displayName = 'TrashBin';
