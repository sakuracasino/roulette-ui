import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

import { networks } from '../libs/NetworkHelper';
import { updateNetwork } from '../flux/slices/networkSlice';
import { shortAccount } from '../libs/utils';

import Message from './Message';
import Dialog from './Dialog';

const injectedConnector = new InjectedConnector({
  supportedChainIds: networks.map((network: {chainId: number}) => network.chainId),
})

const walletconnect = new WalletConnectConnector({
  rpc: { 42: 'https://kovan.infura.io/v3/082736a20e224d5ba41350cef02a7d45' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000
})

// @ts-ignore
import MetamaskLogo from '../assets/metamask.png';
// @ts-ignore
import WalletConnectLogo from '../assets/walletconnect.svg';
import './ConnectWalletButton.scss';

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
      case 'UserRejectedRequestError':
        return 'Error: request was rejected';
      default:
        console.error(error);
        return 'Unknow error, please check the console';
    }
  }
  return null;
}

function Address({address} : {address: string}) {
  return (
    <div className="Address">
      <div className="Address__label">Current address</div>
      <div className="Address__value">{address}</div>
    </div>
  );
}


function ConnectDialog({opened, onClose}: {opened: boolean, onClose: () => void}) {
  const web3React = useWeb3React<Web3Provider>();
  const error = getError(web3React.error);

  function activateMetamask() {
    if (web3React.active) web3React.deactivate();
    web3React.activate(injectedConnector);
  }
  function activateWalletConnect() {
    if (web3React.active) web3React.deactivate();
    web3React.activate(walletconnect, () => web3React.deactivate());
  }

  const metamaskConnectorClasses = classNames({
    'ConnectWalletDialog__connector': true,
    'ConnectWalletDialog__connector--current': web3React.connector === injectedConnector && web3React.active,
  });

  const walletconnectConnectorClasses = classNames({
    'ConnectWalletDialog__connector': true,
    'ConnectWalletDialog__connector--current': web3React.connector === walletconnect && web3React.active,
  });

  return (
    <Dialog open={opened} onCloseModal={onClose} className="ConnectWalletDialog__container">
      <div className="ConnectWalletDialog">
        <div className="ConnectWalletDialog__header">
          {web3React.active ? 'Change connector' : 'Connect to a wallet'}
        </div>
        <div className="ConnectWalletDialog__body">
          {web3React.active ? <Address address={web3React.account} /> : null}
          {error ? <Message type="error">{error}</Message> : null}
          <button className={metamaskConnectorClasses} onClick={activateMetamask}>
            <div className="ConnectWalletDialog__connector-name">Metamask</div>
            <img className="ConnectWalletDialog__connector-logo" src={MetamaskLogo} />
          </button>
          <button className={walletconnectConnectorClasses} onClick={activateWalletConnect}>
            <div className="ConnectWalletDialog__connector-name">WalletConnect</div>
            <img className="ConnectWalletDialog__connector-logo" src={WalletConnectLogo} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function ConnectWalletButton() {
  const [openedDialog, setOpenedDialog] = useState(false);
  const dispatch = useDispatch();
  const web3React = useWeb3React<Web3Provider>();
  const networkSupported = isSupportedNetwork(web3React);
  const accountBalance = useSelector(state => state.network.accountBalance);

  useEffect(() => {
    injectedConnector.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        web3React.activate(injectedConnector, undefined, true).catch(() => {})
      }
    })
  }, [web3React.activate]) // intentionally only running on mount

  useEffect(() => {
    if (web3React.active) {
      setOpenedDialog(false)
      dispatch(updateNetwork(web3React));
    }
  }, [web3React.active])

  const classes = classNames({
    'ConnectWalletButton': true,
    'ConnectWalletButton--account': networkSupported && web3React.account,
    'ConnectWalletButton--error': !networkSupported,
  });
  const address = web3React.account ? shortAccount(web3React.account) : 'Connect to a wallet';

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