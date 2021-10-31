import * as React from 'react';
import { Card } from '@components/Card';
import { CardData } from '@store/kanban';

import './Column.css';

export interface ColumnProps {
  color?: string,
  title?: string,
  cards: CardData[],
}

export const Column = (props: ColumnProps) => {
  const { color: backgroundColor, title, cards } = props;

  // use #rrggbbaa hex format
  const transparentizedColor = `${backgroundColor}64`;

  return (
    <div className="w-full">
      <div style={{ backgroundColor }} className="p-md mb-xsm text-white text-2xl text-center font-semibold">
        {title}
      </div>
      <div style={{ backgroundColor: transparentizedColor }} className="h-full column-content p-md">
        <div className="flex flex-wrap gap-md items-start">
          {cards.map((card) => (
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
