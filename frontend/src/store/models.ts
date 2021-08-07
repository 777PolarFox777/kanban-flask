import { Models } from '@rematch/core';
import { kanban } from './kanban';
import { user } from './user';

export interface RootModel extends Models<RootModel> {
  user: typeof user,
  kanban: typeof kanban,
}

export const models: RootModel = {
  user,
  kanban,
};
