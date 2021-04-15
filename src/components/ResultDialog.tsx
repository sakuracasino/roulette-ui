import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import classNames from 'classnames';

import NetworkHelper from '../libs/NetworkHelper';
import { AppState } from '../flux/store';
import Dialog from './Dialog';

import './ResultDialog.scss';
const ResultDialog = () => {
  const account = useSelector((state: AppState) => state.network.account);
  const [opened, setOpened] = useState(false);
  const [payout, setPayout] = useState('');
  const [result, setResult] = useState('');
  const web3React = useWeb3React<Web3Provider>();

  useEffect(() => {
    if(web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      const betResultCallback = (requestId: string, _result: BigNumber, _payout: BigNumber) => {
        const result = _result.toString();
        const payout = formatEther(_payout);
        setOpened(true);
        setPayout(Number(payout) ? payout : '');
        setResult(result);
      };
      roulette.on('BetResult', betResultCallback);
      return () => {
        roulette.off('BetResult', betResultCallback);
      };
    }
  }, [web3React.active, account]);

  const classes = classNames({
    'ResultDialog': true,
    'ResultDialog--lost': !payout
  });

  return (
    <Dialog open={opened} onCloseModal={() => setOpened(false)} className="ResultDialog__container">
      <div className={classes}>
        <div className="ResultDialog__header">
          Result is
        </div>
        <div className="ResultDialog__result">
          {result}
        </div>
        <div className="ResultDialog__payout-message">
          {!payout ? 'You lost!' : <>You received <span className="payout-amount">${payout}</span>!</>}
        </div>
      </div>
    </Dialog>
  );
};

export default ResultDialog;
