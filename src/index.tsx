import React          from 'react';
import ReactDOM       from 'react-dom';
import { Provider }   from 'react-redux';
import logger         from 'redux-logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import Layout from './components/Layout';

const reducers = combineReducers({});
const store = createStore(reducers, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      xx
    </Layout>
  </Provider>,
  document.getElementById('root')
);