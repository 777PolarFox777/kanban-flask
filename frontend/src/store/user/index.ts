import { createModel } from '@rematch/core';
import type { RootModel } from '@store/models';
import { RootState } from '@store';

export interface User {
  id: number,
  name: string,
  email: string,
}

export interface UserModel {
  data: User | null,
}

export const user = createModel<RootModel>()({
  state: {
    data: null,
  } as UserModel,
  reducers: {
    setUser(state, payload: User | null) {
      return { ...state, data: payload };
    },
  },
  effects: (dispatch) => ({
    async fetchUser() {
      dispatch.user.setUser(null);
    },
  }),
});

export const getUser = (state: RootState) => state.user.data;
