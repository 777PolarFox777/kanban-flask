import * as React from 'react';
import { Column } from '@components/Column';
import { useDispatch } from '@store/dispatch';
import { useSelector } from 'react-redux';
import { getKanban } from '@store/kanban';
import { sortBy } from 'lodash';

export const Kanban = () => {
  const dispatch = useDispatch();
  const columns = useSelector(getKanban);

  React.useEffect((): void => {
    dispatch.kanban.fetchData();
  }, []);

  return (
    <main className="pt-xxl px-xxl flex space-x-xsm flex-grow">
      {sortBy(columns, ['order']).map((column) => (
        <Column key={column.id} {...column} />
      ))}
    </main>
  );
};

Kanban.displayName = 'Kanban';
