import { createModel } from '@rematch/core';
import type { RootModel } from '@store/models';
import { request } from '@utils/request';
import { ApiUrls } from '@constants';
import { pick, sortBy } from 'lodash';
import type { RootState } from '@store';
import type { ApiResponse } from '../../commonTypes';

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
      const newData = state.columns.map((column) => {
        if (column.id === payload.id) {
          return { ...column, ...payload };
        }

        return column;
      });

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

export interface GetSiblingOptions {
  position: 'next' | 'prev', fromId: number, toId: number
  items: any,
}

export const getSibling = <T extends { id: number }>(position: 'next' | 'prev', id: number, items: T[]): T | undefined => {
  const sortedItems = sortBy(items, ['order']);
  const currentItemPosition = sortedItems.findIndex((item) => item.id === id);

  if (currentItemPosition === -1) {
    throw new Error(`Item with id: ${id} is not present in cards list.`);
  }

  if (position === 'next') {
    return sortedItems[currentItemPosition + 1];
  }

  return sortedItems[currentItemPosition - 1];
};

export const getSiblingCards = (
  fromId: number,
  toId: number,
) => (state: RootState): [CardData | undefined, CardData | undefined] => {
  const currentItem = state.kanban.cards.find((item) => item.id === toId);
  const items = state.kanban.cards.filter(
    (card) => card.id !== fromId && card.columnId === currentItem?.columnId,
  );

  return [
    getSibling('prev', toId, items),
    getSibling('next', toId, items),
  ];
};

export const getSiblingColumns = (
  id: number,
) => (state: RootState): [ColumnData | undefined, ColumnData | undefined] => [
  getSibling('prev', id, state.kanban.columns),
  getSibling('next', id, state.kanban.columns),
];
