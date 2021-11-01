import * as React from 'react';
import cn from 'classnames';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string,
}

export const Button = (props: ButtonProps) => {
  const { children, className, ...rest } = props;

  return (
    <button type="button" className={cn(className, 'flex items-center p-sm')} {...rest}>
      {children}
    </button>
  );
};

Button.displayName = 'Button';
