import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'inter-ui';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import './index.scss';
import store from './flux/store';
import Layout from './components/Layout';
import BetPage from './components/BetPage';
import PoolPage from './components/PoolPage';

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

function getWeb3Library(provider, connector) {
  return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getWeb3Library}>
    <Provider store={store}>
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact>
              <BetPage />
            </Route>
            <Route path="/pool">
              <PoolPage />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </Provider>
  </Web3ReactProvider>,
  document.getElementById('root'),
);
