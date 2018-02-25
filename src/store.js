import { applyMiddleware, combineReducers, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import chips from './reducers/chips-reducer'

const rootReducer = combineReducers({
  chips
})

const initialState = {}

const middleware = applyMiddleware(
  logger,
  thunk
)

export default createStore(rootReducer, initialState, middleware)