import React from 'react';
import { createRoot } from 'react-dom/client';
import BetMenu from './BetMenu';
import { Provider } from 'react-redux'
import store from '../store'

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<Provider store={store}><BetMenu /></Provider>);
  root.unmount()
});
