import * as React from 'react';
import { Column } from '@components/Column';
import { useDispatch } from '@store/dispatch';
import { useSelector } from 'react-redux';
import { getColumns } from '@store/kanban';
import { sortBy } from 'lodash';
import { TrashBin } from '@components/TrashBin';

export const Kanban = () => {
  const dispatch = useDispatch();
  const columns = useSelector(getColumns);

  React.useEffect((): void => {
    dispatch.kanban.fetchData();
  }, []);

  return (
    <main className="pt-xxl px-xxl">
      <TrashBin />
      <div className="flex space-x-xsm flex-grow">
        {sortBy(columns, ['order']).map((column) => (
          <Column key={column.id} {...column} />
        ))}
      </div>
    </main>
  );
};

Kanban.displayName = 'Kanban';
