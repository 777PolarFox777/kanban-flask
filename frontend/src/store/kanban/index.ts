import { createModel } from '@rematch/core';
import type { RootModel } from '@store/models';
import { RootState } from '@store';
import { request } from '@utils/request';
import { ApiUrls } from '@constants';
import { ApiResponse } from '../../commonTypes';

export interface CardData {
  id: number,
  columnId: number,
  text: string,
  order: number,
}

export interface ColumnData {
  id: number,
  userId: number
  title: string,
  color: string,
  order: number,
  cards: CardData[],
}

export interface KanbanModel {
  data: ColumnData[],
}

export const kanban = createModel<RootModel>()({
  state: {
    data: [],
  } as KanbanModel,
  reducers: {
    setData(state, payload: ColumnData[]) {
      return { ...state, data: payload };
    },
  },
  effects: (dispatch) => ({
    async fetchData() {
      try {
        const { data } = await request.get<ApiResponse<ColumnData[]>>(ApiUrls.ColumnList);

        await Promise.all(
          data.data.map(
            async (column: ColumnData) => {
              try {
                const { data: { data: cards } } = await request.get<ApiResponse<CardData[]>>(
                  ApiUrls.CardList,
                  { params: { columnId: column.id } },
                );

                column.cards = cards ?? [];
              } catch {
                column.cards = [];
              }
            },
          ),
        );

        dispatch.kanban.setData(data.data);
      } catch {
        // TODO: add error handling
      }
    },
  }),
});

export const getKanban = (state: RootState) => state.kanban.data;
