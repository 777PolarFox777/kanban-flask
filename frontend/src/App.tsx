import React from 'react';
import { Kanban } from '@pages';
import { Header } from '@components/Header';
import { Provider } from 'react-redux';
import { store } from '@store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.css';

export const App = () => (
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <div className="font-sans flex flex-col h-full">
        <Header />
        <Kanban />
      </div>
    </DndProvider>
  </Provider>
);

App.displayName = 'App';
