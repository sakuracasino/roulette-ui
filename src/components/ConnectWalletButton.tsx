import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { networks } from '../libs/NetworkHelper';

import Message from './Message';

const injectedConnector = new InjectedConnector({
  supportedChainIds: networks.map((network: {chainId: number}) => network.chainId),
})

const walletconnect = new WalletConnectConnector({
  rpc: { 1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000
})

import Dialog from './Dialog';
// @ts-ignore
import MetamaskLogo from '../assets/metamask.png';
// @ts-ignore
import WalletConnectLogo from '../assets/walletconnect.svg';
import './ConnectWalletButton.scss';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useDispatch, useSelector } from 'react-redux';
import { updateNetwork } from '../flux/slices/networkSlice';

function isSupportedNetwork(web3React: Web3ReactContextInterface<Web3Provider>) {
  if(web3React?.error) {
    return web3React?.error?.name !== 'UnsupportedChainIdError';
  } else {
    return true;
  }
}

function getError(error: Error | undefined) {
  if (error) {
    switch(error.name) {
      case 'UnsupportedChainIdError':
        const networksList = networks.map((network: {network: string}) => network.network).join(', ')
        return (
          <div>
            Network is not supported, please use one of supported networks:
            <div>
              {networksList}
            </div>
          </div>
        );
      default:
        console.error(error);
        return 'Unknow error, please check the console';
    }
  }
  return null;
}


function ConnectDialog({opened, onClose}: {opened: boolean, onClose: () => void}) {
  const web3React = useWeb3React<Web3Provider>();
  const error = getError(web3React.error);
  window.web3React = web3React;

  function activateMetamask() {
    console.log('activateMetamask');
    web3React.activate(injectedConnector).then(() => {
      console.log(1);
    });
  }
  function activateWalletConnect() {
    console.log('activateWalletConnect');
    web3React.activate(walletconnect);
  }

  return (
    <Dialog open={opened} onCloseModal={onClose} className="ConnectWalletDialog__container">
      <div className="ConnectWalletDialog">
        <div className="ConnectWalletDialog__header">
          Connect to a wallet
        </div>
        <div className="ConnectWalletDialog__body">
          {error ? <Message type="error">{error}</Message> : null}
          <button className="ConnectWalletDialog__connector" onClick={activateMetamask}>
            <div className="ConnectWalletDialog__connector-name">Metamask</div>
            <img className="ConnectWalletDialog__connector-logo" src={MetamaskLogo} />
          </button>
          <button className="ConnectWalletDialog__connector" onClick={activateWalletConnect}>
            <div className="ConnectWalletDialog__connector-name">WalletConnect</div>
            <img className="ConnectWalletDialog__connector-logo" src={WalletConnectLogo} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function AddressDetailsButton() {
  return (
    <div>
      
    </div>
  );
}

function ConnectWalletButton() {
  const [openedDialog, setOpenedDialog] = useState(false);
  const dispatch = useDispatch();
  const web3React = useWeb3React<Web3Provider>();
  const networkSupported = isSupportedNetwork(web3React);
  const accountBalance = useSelector(state => state.network.accountBalance);

  useEffect(() => {
    if (web3React.active) {
      console.log('############## active');
      dispatch(updateNetwork(web3React));
    } else {
      console.log('############## not active');
    }
  }, [web3React.active])

  const classes = classNames({
    'ConnectWalletButton': true,
    'ConnectWalletButton--account': networkSupported && web3React.account,
    'ConnectWalletButton--error': !networkSupported,
  });
  const address = web3React.account ? `
    ${web3React.account.slice(0,6)}...${web3React.account.slice(-4)}
  ` : 'Connect to a wallet';

  return (
    <React.Fragment>
      <div className={web3React.account ? 'ConnectWalletButton__balance-container' : ''}>
        {web3React.account ? (
          <div className="ConnectWalletButton__balance">
            ${accountBalance.toFixed(2)} (DAI)
          </div>
        ) : null}
        <button className={classes} onClick={() => setOpenedDialog(true)}>
          {networkSupported ? address : 'Wrong Network'}
        </button>
      </div>
      <ConnectDialog opened={openedDialog} onClose={() => setOpenedDialog(false)} />
    </React.Fragment>
  );
}

export default ConnectWalletButton;