import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatEther } from '@ethersproject/units';

import Tabs from './Tabs';
import BetBadge from './BetBadge';
import NetworkHelper from '../libs/NetworkHelper';
import { shortAccount } from '../libs/utils';
import { BetType, RollRequest } from '../types.d';
import './LastRolls.scss';
import { AppState } from '../flux/store';
import { addRollRequest, updateRollRequest } from '../flux/slices/networkSlice';
import { BigNumber } from '@ethersproject/bignumber';

const LastRolls = () => {
  const web3React = useWeb3React();
  const dispatch = useDispatch();
  const account: string = useSelector((state: AppState) => state.network.account);
  const rollHistory: RollRequest[] = useSelector((state: AppState) => state.network.rollHistory);
  const [showAllRolls, setShowAllRolls] = useState(true);
  useEffect(() => {
    if(web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      const resolveRollRequest = (requestId: string, randomResult: BigNumber, payout: BigNumber) => {
        dispatch(updateRollRequest({
          requestId,
          randomResult,
          payout,
        }));
      };
      const setRollRequest = (requestId: string, sender: string) => {
        dispatch(addRollRequest({
          requestId,
          address: sender,
        }))
      };
      roulette.on('BetResult', resolveRollRequest);
      roulette.on('BetRequest', setRollRequest);
    }
  }, [web3React.active]);

  const renderRoll = (roll: RollRequest) => {
    let rollResultNode = (
      <div className="LastRolls__roll-loader">
        <div className="loader"></div>
      </div>
    );

    if (roll.payout !== null) {
      rollResultNode = (
        <div className="LastRolls__roll-result">
          <div className="LastRolls__roll-badge">
            <BetBadge bet={{type: BetType.Number, value: Number(BigNumber.from(roll.randomResult))}} />
          </div>
          <div className="LastRolls__roll-payout">
            {Number(BigNumber.from(roll.payout)) ? <span className="positive">${formatEther(BigNumber.from(roll.payout))}</span> : 'LOSE'}
          </div>
        </div>
      );
    }

    return (
      <div className="LastRolls__roll" key={`last-rolls-${showAllRolls ? 1 : 0}-${roll.requestId}`}>
        {rollResultNode}
        <div className="LastRolls__roll-account">
          {shortAccount(roll.address)}
        </div>
      </div>
    );
  }

  return (
    <div className="LastRolls">
      <div className="LastRolls__menu">
        <Tabs
          selectedIndex={showAllRolls ? 0 : 1}
          tabs={[
            {content: 'All Rolls', onClick: () => setShowAllRolls(true)},
            {content: 'My Rolls', onClick: () => setShowAllRolls(false)}
          ]}
        />
      </div>
      <div className="LastRolls__rolls">
        {
          [...rollHistory]
            .reverse()
            .filter(roll => showAllRolls || roll.address === account)
            .filter((_, index) => index < 30)
            .map(renderRoll)
        }
      </div>
    </div>
  );
}

export default LastRolls;