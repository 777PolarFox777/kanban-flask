import * as React from 'react';
import cn from 'classnames';
import { Card } from '@components/Card';
import mockCards from '../../mocks/cards.json';

import './Column.css';

export interface ColumnProps {
  color?: string,
  title?: string,
}

export const Column = (props: ColumnProps) => {
  const { color: backgroundColor, title } = props;

  // use #rrggbbaa hex format
  const transparentizedColor = `${backgroundColor}64`;

  return (
    <div className="w-full">
      <div style={{ backgroundColor }} className="p-md mb-xsm text-white text-2xl text-center font-semibold">
        {title}
      </div>
      <div style={{ backgroundColor: transparentizedColor }} className="h-full column-content p-md">
        <div className="flex flex-wrap gap-md items-start">
          {mockCards.map((card) => (
            <Card key={card.id} color={transparentizedColor}>
              {card.text}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

Column.displayName = 'Column';
