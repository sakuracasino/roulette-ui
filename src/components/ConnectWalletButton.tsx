import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React, UnsupportedChainIdError,  } from '@web3-react/core'
import { InjectedConnector, UserRejectedRequestError } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

import { NETWORK_URLS } from '../data/chains';
import { shortAccount } from '../libs/utils';
import { networks, supportedChainIds } from '../libs/NetworkHelper';
import { updateNetwork } from '../flux/slices/networkSlice';
import { AppState } from '../flux/store';

import Message from './Message';
import Dialog from './Dialog';

const injectedConnector = new InjectedConnector({
  supportedChainIds,
});

const walletconnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: NETWORK_URLS,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
});

// @ts-ignore
import MetamaskLogo from '../assets/metamask.png';
// @ts-ignore
import WalletConnectLogo from '../assets/walletconnect.svg';
import './ConnectWalletButton.scss';

function isSupportedNetwork(web3React: Web3ReactContextInterface<Web3Provider>) {
  if(web3React?.error) {
    return !(web3React.error instanceof UnsupportedChainIdError);
  } else {
    return true;
  }
}

function getError(error: Error | undefined) {
  if (error) {
    if (error instanceof UnsupportedChainIdError) {
      const networksList = networks.map((network: {title: string}) => network.title).join(', ')
      return (
        <div>
          Network is not supported, please use one of supported networks:
          <div>
            {networksList}
          </div>
        </div>
      );
    } else if (error instanceof UserRejectedRequestError) {
      return 'Error: request was rejected';
    } else {
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

  // kudos to Uniswap/uniswap-interface, thanks guys :'v
  async function activateConnector(connector: AbstractConnector | undefined) {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      web3React.activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          web3React.activate(connector) // a little janky...can't use setError because the connector isn't set
        }
      });
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
          <Message className="ConnectWalletDialog__disclaimer" type="warning">
            This app only works with<span> </span> 
            <a href="https://docs.matic.network/docs/develop/metamask/config-matic/" target="_blank">
              Matic network
            </a>
          </Message>
          {(web3React.active && web3React.account) ? <Address address={web3React.account} /> : null}
          {error ? <Message type="error">{error}</Message> : null}
          <button className={metamaskConnectorClasses} onClick={() => activateConnector(injectedConnector)}>
            <div className="ConnectWalletDialog__connector-name">Metamask</div>
            <img className="ConnectWalletDialog__connector-logo" src={MetamaskLogo} />
          </button>
          <button className={walletconnectConnectorClasses} onClick={() => activateConnector(walletconnect)}>
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
  const accountBalance = useSelector((state: AppState) => state.network.accountBalance);

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