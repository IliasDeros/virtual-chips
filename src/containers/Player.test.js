import React from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import { Provider } from 'react-redux'
import store from '../store'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Player /></Provider>, div);
});
