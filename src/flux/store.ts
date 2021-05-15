import {configureStore} from '@reduxjs/toolkit';
import {routerMiddleware} from 'react-router-redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import { save, load } from 'redux-localstorage-simple';
import { routerReducer } from 'react-router-redux';

import betPoolReducer from './slices/betPoolSlice';
import networkReducer from './slices/networkSlice';

const PERSISTED_KEYS = ['network'];

const middlewares = [
  thunk,
  routerMiddleware(createBrowserHistory()),
  save({states: PERSISTED_KEYS}),
];

if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

const store = configureStore({
  reducer: {
    routing: routerReducer,
    betPool: betPoolReducer,
    network: networkReducer,
  },
  middleware: middlewares,
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export type AppState = ReturnType<typeof store.getState>
export default store;
