import * as React from 'react';
import { Column } from '@components/Column';

export const Kanban = () => (
  <main className="pt-xxl px-xxl flex space-x-xsm flex-grow">
    <Column title="Todo" className="bg-blue-500" />
    <Column title="In progress" className="bg-yellow-500" />
    <Column title="In review" className="bg-purple-500" />
    <Column title="Done" className="bg-green-500" />
  </main>
);

Kanban.displayName = 'Kanban';
