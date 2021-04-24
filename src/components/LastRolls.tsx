import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';

import Tabs from './Tabs';
import BetBadge from './BetBadge';
import NetworkHelper, { RollLog } from '../libs/NetworkHelper';
import { shortAccount } from '../libs/utils';
import { BetType } from '../types.d';
import './LastRolls.scss';
import { AppState } from '../flux/store';

const LastRolls = () => {
  const web3React = useWeb3React();
  const account: string = useSelector((state: AppState) => state.network.account);
  const [rolls, setRolls] = useState<RollLog[]>([])
  const [showAllRolls, setShowAllRolls] = useState(true)
  useEffect(() => {
    if(web3React.active) {
      const updateRollHistory = () => networkHelper.getRollHistory().then((rollHistory: RollLog[]) => setRolls(rollHistory.reverse()));
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      roulette.on('BetResult', updateRollHistory);
      roulette.on('BetRequest', updateRollHistory);
      updateRollHistory();
    }
  }, [web3React.active]);
  console.log(rolls);

  const renderRoll = (roll: RollLog) => {
    let rollResultNode = (
      <div className="LastRolls__roll-loader">
        <div className="loader"></div>
      </div>
    );

    if (roll.completed) {
      rollResultNode = (
        <div className="LastRolls__roll-result">
          <div className="LastRolls__roll-badge">
            <BetBadge bet={{type: BetType.Number, value: Number(roll.randomResult)}} />
          </div>
          <div className="LastRolls__roll-payout">
            {Number(roll.payout) ? <span className="positive">${roll.payout}</span> : 'LOSE'}
          </div>
        </div>
      );
    }

    return (
      <div className="LastRolls__roll" key={`last-rolls-${showAllRolls ? 1 : 0}-${roll.requestId}`}>
        {rollResultNode}
        <div className="LastRolls__roll-account">
          {shortAccount(roll.sender)}
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
          rolls
            .filter(roll => showAllRolls || roll.sender === account)
            .filter((_, index) => index < 100)
            .map(renderRoll)
        }
      </div>
    </div>
  );
}

export default LastRolls;