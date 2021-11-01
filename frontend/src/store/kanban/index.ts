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
    updateColumn(state, payload: Partial<ColumnData>) {
      const { order: newOrder } = payload;
      let order = -1;
      const newData = state.data.map((column) => {
        if (column.id === payload.id) {
          order = column.order;
          return { ...column, ...payload };
        }

        return column;
      });

      // recalculate order
      if (newOrder && order > 0) {
        const orderDirection = Math.sign(order - newOrder);

        const sortedData = newData.map((column) => {
          if (column.id === payload.id || orderDirection === 0) {
            return column;
          }

          if (orderDirection > 0 && column.order >= newOrder) {
            return { ...column, order: column.order + 1 };
          }

          if (orderDirection < 0 && column.order <= newOrder) {
            return { ...column, order: column.order - 1 };
          }

          return column;
        });

        return { ...state, data: sortedData };
      }

      return { ...state, data: newData };
    },
    addCard(state, payload: CardData) {
      const newData = state.data.map((column) => {
        if (column.id === payload.columnId) {
          return {
            ...column,
            cards: [payload, ...column.cards],
          };
        }

        return column;
      });

      return { ...state, data: newData };
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
    async createCard(card: Omit<CardData, 'id'>) {
      try {
        const { data } = await request.post<ApiResponse<CardData>>(ApiUrls.Card, card);

        dispatch.kanban.addCard(data.data);
      } catch {
        // TODO: add error handling
      }
    },
  }),
});

export const getKanban = (state: RootState) => state.kanban.data;
