import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';

import combinedReducers from './reducers';

const middlewares = [
  thunk,
  routerMiddleware(history),
];

if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

const store = createStore(
  combinedReducers,
  applyMiddleware(...middlewares),
);

export default store;
