import React          from 'react';
import ReactDOM       from 'react-dom';
import { Provider }   from 'react-redux';
import store          from './flux/store';

import Layout from './components/Layout';
import BetPage from './components/BetPage';

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <BetPage />
    </Layout>
  </Provider>,
  document.getElementById('root')
);