import React from 'react'
import PlayerToken from './PlayerToken'
import { Provider } from 'react-redux'
import store from '../store'
import { createRoot } from 'react-dom/cjs/react-dom.production.min'

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<Provider store={store}><PlayerToken /></Provider>);
  root.unmount()
})
