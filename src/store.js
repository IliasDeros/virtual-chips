import { applyMiddleware, combineReducers, createStore } from 'redux'
import logger from 'redux-logger'
import chips from './reducers/chips-reducer'

const rootReducer = combineReducers({
  chips
})

const initialState = {}

const middleware = applyMiddleware(
  logger
)

export default createStore(rootReducer, initialState, middleware)