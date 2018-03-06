import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from '../store'
import Fingerprint from 'fingerprintjs2'

it('renders without crashing', () => {
  Fingerprint.prototype.get = jest.fn()

  const div = document.createElement('div')

  ReactDOM.render(<Provider store={store}><App /></Provider>, div)
})
