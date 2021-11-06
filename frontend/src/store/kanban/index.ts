import { createModel } from '@rematch/core';
import type { RootModel } from '@store/models';
import { request } from '@utils/request';
import { ApiUrls } from '@constants';
import { pick } from 'lodash';
import { RootState } from '@store';
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
}

export interface KanbanModel {
  cards: CardData[],
  columns: ColumnData[],
}

export const kanban = createModel<RootModel>()({
  state: {
    cards: [],
    columns: [],
  } as KanbanModel,
  reducers: {
    setColumns(state, payload: ColumnData[]) {
      return { ...state, columns: payload };
    },
    setCards(state, payload: CardData[]) {
      return { ...state, cards: payload };
    },
    updateCard(state, payload: Partial<CardData>) {
      const { id } = payload;

      const newData = state.cards.map((card) => {
        if (card.id === id) {
          return { ...card, ...payload };
        }

        return card;
      });

      return { ...state, cards: newData };
    },
    updateColumn(state, payload: Partial<ColumnData>) {
      const { order: newOrder } = payload;
      let order = -1;
      const newData = state.columns.map((column) => {
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

          if (orderDirection > 0 && column.order >= newOrder && column.order <= order) {
            return { ...column, order: column.order + 1 };
          }

          if (orderDirection < 0 && column.order <= newOrder && column.order >= order) {
            return { ...column, order: column.order - 1 };
          }

          return column;
        });

        return { ...state, columns: sortedData };
      }

      return { ...state, columns: newData };
    },
  },
  effects: (dispatch) => ({
    async syncCards(options: { ids?: number[], fields?: string[] }, rootState) {
      const { ids, fields } = options;
      const { cards } = rootState.kanban;

      try {
        await Promise.all(
          cards
            .filter((card) => (ids ? ids.includes(card.id) : true))
            .map((card) => request.put(
              `${ApiUrls.Card}/${card.id}`,
              fields ? pick(card, fields) : card,
            )),
        );
      } catch {
        // TODO: add error handling
      }
    },
    async fetchData() {
      try {
        const { data: { data: columns } } = await request.get<ApiResponse<ColumnData[]>>(
          ApiUrls.ColumnList,
        );

        dispatch.kanban.setColumns(columns);

        const { data: { data: cards } } = await request.get<ApiResponse<CardData[]>>(
          ApiUrls.CardList,
        );

        dispatch.kanban.setCards(cards);
      } catch {
        // TODO: add error handling
      }
    },
    async createCard(payload: Omit<CardData, 'id'>, rootState) {
      const { cards } = rootState.kanban;
      try {
        const { data: { data: card } } = await request.post<ApiResponse<CardData>>(
          ApiUrls.Card,
          payload,
        );
        const newData = [card, ...cards];

        dispatch.kanban.setCards(newData);
      } catch {
        // TODO: add error notification
      }
    },
    async removeCard(id: number, rootState) {
      const data = [...rootState.kanban.cards];
      try {
        const newData = data.filter((card) => card.id !== id);
        // positive rendering
        dispatch.kanban.setCards(newData);

        await request.delete(`${ApiUrls.Card}/${id}`);
      } catch {
        // TODO: add error notification
        dispatch.kanban.setCards(data);
      }
    },
  }),
});

export const getColumns = (state: RootState) => state.kanban.columns;
export const getCards = (columnId: number) => (state: RootState) => state.kanban.cards.filter(
  (card) => card.columnId === columnId,
);
