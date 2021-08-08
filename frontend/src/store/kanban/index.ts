import { createModel } from '@rematch/core';
import type { RootModel } from '@store/models';
import { RootState } from '@store';
import { request } from '@utils/request';
import { ApiUrls } from '@constants';

export interface Column {
  id: number,
  userId: number
  title: string,
  color: string,
  order: number,
}

export interface KanbanModel {
  data: Column[],
}

export const kanban = createModel<RootModel>()({
  state: {
    data: [],
  } as KanbanModel,
  reducers: {
    setData(state, payload: Column[]) {
      return { ...state, data: payload };
    },
  },
  effects: (dispatch) => ({
    async fetchData() {
      try {
        const { data } = await request.get(ApiUrls.ColumnList);

        dispatch.kanban.setData(data.data);
      } catch (err) {
        // TODO: add error handling
      }
    },
  }),
});

export const getKanban = (state: RootState) => state.kanban.data;
