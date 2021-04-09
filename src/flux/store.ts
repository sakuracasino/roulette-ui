import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {createBrowserHistory} from 'history';

import betPoolReducer from './slices/betPoolSlice';
import networkReducer from './slices/networkSlice';

const combinedReducers = combineReducers({
  routing: routerReducer,
  betPool: betPoolReducer,
  network: networkReducer,
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
