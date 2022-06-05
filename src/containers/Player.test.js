import React from 'react'
import { createRoot } from 'react-dom/client'
import Player from './Player'
import { Provider } from 'react-redux'
import store from '../store'

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<Provider store={store}><Player /></Provider>);
  root.unmount()
})
