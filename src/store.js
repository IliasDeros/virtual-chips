import { applyMiddleware, combineReducers, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import chips from './reducers/chips-reducer'
import opponents from './reducers/opponents-reducer'
import player from './reducers/player-reducer'
import table from './reducers/table-reducer'

const rootReducer = combineReducers({
  chips,
  opponents,
  player,
  table
})

const initialState = {}

const middleware = applyMiddleware(
  thunk,
  logger
)

export default createStore(rootReducer, initialState, middleware)