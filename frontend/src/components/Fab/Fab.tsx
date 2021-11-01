import * as React from 'react';
import cn from 'classnames';

export interface FabProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string,
}

export const Fab = (props: FabProps) => {
  const { children, className, ...rest } = props;

  return (
    <button type="button" className={cn(className, 'border-none flex m-md p-sm')} {...rest}>
      {children}
    </button>
  );
};

Fab.displayName = 'Fab';
