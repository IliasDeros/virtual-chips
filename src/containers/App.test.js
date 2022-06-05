import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from '../store'
import Fingerprint from 'fingerprintjs2'

it('renders without crashing', () => {
  Fingerprint.prototype.get = jest.fn()

  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<Provider store={store}><App /></Provider>)
  root.unmount()
})
