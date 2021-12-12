import type { DropTargetMonitor } from 'react-dnd/dist/types/types';
import type React from 'react';
import { debounce } from 'lodash';

let lastDraggable: HTMLElement | null = null;

const cleanUp = debounce(() => {
  lastDraggable = null;
}, 500);

export const onDragHover = <T extends { id: number }>(
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: (item: T, monitor: DropTargetMonitor) => void,
) => (item: T, monitor: DropTargetMonitor) => {
    if (!ref.current) {
      return;
    }

    if (Number(ref.current?.dataset.id) === item.id) {
      return;
    }

    cleanUp();

    const isTheSameElement = lastDraggable === ref.current;

    if (isTheSameElement) {
      return;
    }

    lastDraggable = ref.current;

    callback(item, monitor);
  };
