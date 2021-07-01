import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { formatEther } from '@ethersproject/units';
import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { abi } from '@sakuracasino/roulette-contract';

import Tabs from './Tabs';
import BetBadge from './BetBadge';
import NetworkHelper from '../libs/NetworkHelper';
import { shortAccount } from '../libs/utils';
import { BetType, RollRequest } from '../types.d';
import './LastRolls.scss';
import { AppState } from '../flux/store';
import { ChainId, NETWORK_EXPLORERS_API_KEYS, NETWORK_EXPLORERS_API_URLS } from '../data/chains';

const LastRolls = () => {
  const web3React = useWeb3React();
  const account: string = useSelector((state: AppState) => state.network.account);
  const [rollHistory, setRollHistory]: [RollRequest[], (rollHistory: any) => any] = useState([]);
  const [showAllRolls, setShowAllRolls] = useState(true);

  useEffect(() => {
    const updateLogs = async () => {
      if(web3React.active && web3React.chainId && Object.values(ChainId).includes(web3React.chainId || 0)) {
        const MATIC_BLOCKS_PER_DAY = 43200;
        const lastBlock = (await web3React.library?.getBlockNumber());
        const minBlock = lastBlock - MATIC_BLOCKS_PER_DAY * 2;
        const url = NETWORK_EXPLORERS_API_URLS[web3React.chainId];
        const apiKey = NETWORK_EXPLORERS_API_KEYS[web3React.chainId];
        const network = new NetworkHelper(web3React).getNetwork();
        const contractInterface = new Interface(abi);
  
        const getLastEventArgs = async (eventName: string) => {
          const params = {
            module: 'logs',
            action: 'getLogs',
            fromBlock: `${minBlock}`,
            toBlock: 'latest',
            address: network.contract_address,
            topic0: contractInterface.getEventTopic(eventName),
            apikey: apiKey,
          };
          const request = await fetch(`${url}?` + new URLSearchParams(params).toString());
          const events = (await request.json()).result;
          console.log('events', events);
          return events.map ? events.map((event: {data: string, topics: string[]}) => {
            const decodedEvent = contractInterface.decodeEventLog(eventName, event.data, event.topics);
            console.log(contractInterface.getEventTopic(eventName));
            return decodedEvent;
          }) : [];
        };
  
        const rollRequestsList = (await getLastEventArgs('BetRequest')).map((args: {requestId: string, sender: string}): RollRequest => ({
          requestId: args.requestId,
          address: args.sender,
          randomResult: null,
          payout: null
        }));
        const rollRequestsMap = rollRequestsList.reduce((object: {[key: string]: RollRequest}, item: RollRequest) => {
          object[item.requestId] = item;
          return object;
        }, {});
        (await getLastEventArgs('BetResult')).forEach((args: {requestId: string, randomResult: BigNumber, payout: BigNumber}) => {
          if (rollRequestsMap[args.requestId]) {
            rollRequestsMap[args.requestId].randomResult = args.randomResult;
            rollRequestsMap[args.requestId].payout = args.payout;
          }
        });
  
        setRollHistory(rollRequestsList);
      }
    }; 

    if(web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      roulette.on('BetResult', updateLogs);
      roulette.on('BetRequest', updateLogs);
      updateLogs();
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