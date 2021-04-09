import React from 'react';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

// @ts-ignore
import RouletteLogo from '../assets/roulette-logo.svg';
import ConnectWalletButton from './ConnectWalletButton';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    56, // BSC
    1337, // Ganache Local
  ],
})


import './TopBar.scss';
export default function TopBar() {
  const web3React = useWeb3React<Web3Provider>()
  console.log('web3React', web3React);
  // console.log('account', account, chainId);

  function connectToWallet() {  
    web3React.activate(injectedConnector)
  }

  return (
    <div className="TopBar">
      <div className="TopBar__left-menu">
        <img className="TopBar__logo" src={RouletteLogo} />
        <ul className="TopBar__menu">
          <li className="active">Bet</li>
          <li>Deposit</li>
          <li>Pool</li>
          <li>Account: {web3React.account}</li>
        </ul>
      </div>
      <div className="TopBar__right-menu">
        <ConnectWalletButton />
      </div>
    </div>
  );
};