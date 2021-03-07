import React          from 'react';
import ReactDOM       from 'react-dom';
import { Provider }   from 'react-redux';
import store          from './flux/store';
import 'inter-ui';

import Layout from './components/Layout';
import BetPageContainer from './containers/BetPageCointainer';

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <BetPageContainer />
    </Layout>
  </Provider>,
  document.getElementById('root')
);