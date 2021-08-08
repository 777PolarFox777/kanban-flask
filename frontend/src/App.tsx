import React from 'react';
import { Kanban } from '@pages';
import { Header } from '@components/Header';
import { Provider } from 'react-redux';
import { store } from '@store';

import './App.css';

export const App = () => (
  <Provider store={store}>
    <div className="font-sans flex flex-col h-full">
      <Header />
      <Kanban />
    </div>
  </Provider>
);

App.displayName = 'App';
