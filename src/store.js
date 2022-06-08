import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import table from "./reducers/table-reducer";

const rootReducer = combineReducers({
  table,
});

const initialState = {};

const middleware = applyMiddleware(thunk, logger);

export default createStore(rootReducer, initialState, middleware);
