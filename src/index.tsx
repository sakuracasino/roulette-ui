import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './flux/store';
import 'inter-ui';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import './index.scss';

import Layout from './components/Layout';
import BetPageContainer from './containers/BetPageCointainer';

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <BetPageContainer />
    </Layout>
  </Provider>,
  document.getElementById('root'),
);
