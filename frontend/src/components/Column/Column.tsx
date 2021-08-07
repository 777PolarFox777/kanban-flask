import * as React from 'react';
import cn from 'classnames';

import './Column.css';

export interface ColumnProps {
  className?: string,
  title?: string,
}

export const Column = (props: ColumnProps) => {
  const { className, title } = props;
  return (
    <div className="flex-grow">
      <div className={cn(className, 'p-md mb-xsm text-white text-2xl text-center font-semibold')}>
        {title}
      </div>
      <div className={cn(className, 'opacity-25 h-full', 'column-content')} />
    </div>
  );
};

Column.displayName = 'Column';
