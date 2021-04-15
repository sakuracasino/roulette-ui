import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import NetworkHelper from '../libs/NetworkHelper';
import { AppState } from '../flux/store';
import { toggleRollDialog } from '../flux/slices/betPoolSlice';
import Dialog from './Dialog';
import BetBadge from './BetBadge';
import BigButton from './BigButton';
import { Bet } from '../types';
import RouletteGraphic from './RouletteGraphic';
import config from '../config';
import './RollDialog.scss';
import { random32 } from '../libs/utils';
import { useCallback } from 'react';
import { useState } from 'react';


const RollDialog = () => {
  const dispatch = useDispatch();
  const bets: Bet[] = useSelector((state: AppState) => state.betPool.bets);
  const opened: boolean = useSelector((state: AppState) => state.betPool.rollDialogDisplayed);
  const betAmount = bets.reduce((total, bet) => total + bet.amount, 0);
  const web3React = useWeb3React<Web3Provider>();
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setLoading(false);
    dispatch(toggleRollDialog(false));
  };
  const betFee = 0.10; // TODO: Replace with contract value

  const approveRoll = useCallback(async () => {
    const networkHelper = new NetworkHelper(web3React);
    const betsForContract = networkHelper.getBetsForContract(bets);
    const totalAmountBN = betsForContract.reduce(
      (amount, bet) => amount.add(BigNumber.from(bet.amount)),
      BigNumber.from('0')
    );
    setLoading(true);
    const roulette = networkHelper.getRouletteContract();
    const signatureParams = await networkHelper.approveTokenAmount(totalAmountBN);
    const rollTx = await roulette.rollBets(betsForContract, `${random32()}`, ...signatureParams);
    await rollTx.wait(1);
    closeModal();
  }, [web3React]);

  return (
    <Dialog open={opened} onCloseModal={closeModal} className="RollDialog__container">
      <div className="RollDialog">
        <div className="RollDialog__top-area">
          <div className="RollDialog__title">Confirm Roll</div>
          <div className="RollDialog__bets">
            {bets.map((bet) => (
              <div className="RollDialog__bet" key={`rolldialog-bet-${bet.type}-${bet.value}-${bet.id}`}>
                <div className="RollDialog__bet-amount">{bet.amount.toFixed(2)} {config.BET_TOKEN}</div>
                <div className="RollDialog__bet-badge">
                  <BetBadge bet={bet} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="RollDialog__bottom-area">
          {loading ? <RouletteGraphic /> : (
            <>
              <div className="RollDialog__fees">
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Total Price
                  </div>
                  <div className="RollDialog__fee-price highlighted">
                    {`${(betAmount + betFee).toFixed(2)} ${config.BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Bet Amount
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betAmount.toFixed(2)} ${config.BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Bet fee
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betFee.toFixed(2)} ${config.BET_TOKEN}`}
                  </div>
                </div>
              </div>
              <div className="RollDialog__action">
                <BigButton className="BetFormDialog__place-bet-button" onClick={() => approveRoll()}>
                  Approve Roll
                </BigButton>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default RollDialog;
