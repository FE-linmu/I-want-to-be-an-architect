import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { counterReducer } from "./count.redux";
import { user } from "./user.redux";

const store = createStore(
  combineReducers({ counter: counterReducer, user }),
  applyMiddleware(logger, thunk)
);

export default store;
