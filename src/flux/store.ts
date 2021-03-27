import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {createBrowserHistory} from 'history';

import betsReducer from './slices/betsSlice';

const combinedReducers = combineReducers({
  routing: routerReducer,
  bets: betsReducer,
});

const middlewares = [
  thunk,
  routerMiddleware(createBrowserHistory()),
];

if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

const store = createStore(
  combinedReducers,
  applyMiddleware(...middlewares),
);

export type AppState = ReturnType<typeof combinedReducers>
export default store;
