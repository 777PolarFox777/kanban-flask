import React from 'react';
import { Kanban } from '@pages';
import { Header } from '@components/Header';

import './App.css';

export const App = () => (
  <div className="font-sans flex flex-col h-full">
    <Header />
    <Kanban />
  </div>
);

App.displayName = 'App';
