import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { App } from './App';

// TODO: use auth to set the user
Cookies.set('userId', '1');

ReactDOM.render(<App />, document.getElementById('root'));
