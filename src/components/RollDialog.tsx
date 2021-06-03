import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import NetworkHelper from '../libs/NetworkHelper';
import { AppState } from '../flux/store';
import { toggleRollDialog } from '../flux/slices/betPoolSlice';
import { updateNetwork } from '../flux/slices/networkSlice';
import { Bet } from '../types';
import { random32 } from '../libs/utils';

import Dialog, { useDialogAnimation } from './Dialog';
import BetBadge from './BetBadge';
import RouletteGraphic from './RouletteGraphic';

const BET_TOKEN = process.env.BET_TOKEN_NAME || 'DAI';

type Web3Event = {
  event: string,
  args: object,
};

import './RollDialog.scss';
import ApproveButton from './ApproveButton';

const RollDialog = () => {
  const dispatch = useDispatch();
  const bets: Bet[] = useSelector((state: AppState) => state.betPool.bets);
  const opened: boolean = useSelector((state: AppState) => state.betPool.rollDialogDisplayed);
  const betAmount = bets.reduce((total, bet) => total + bet.amount, 0);
  const web3React = useWeb3React<Web3Provider>();
  const [animation, animate] = useDialogAnimation();
  const [loading, setLoading] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');
  const closeModal = () => {
    setLoading(false);
    dispatch(toggleRollDialog(false));
  };
  const betFee: number = useSelector((state: AppState) => state.network.betFee);
  const networkHelper = new NetworkHelper(web3React);
  const betsForContract = networkHelper.getBetsForContract(bets);
  const totalAmountBN = betsForContract.reduce(
    (amount, bet) => amount.add(BigNumber.from(bet.amount)),
    BigNumber.from(networkHelper.toTokenDecimals(betFee))
  );

  const rollBets = useCallback(async (_signatureParams) => {
    const networkHelper = new NetworkHelper(web3React);
    const roulette = networkHelper.getRouletteContract();
    const betsForContract = networkHelper.getBetsForContract(bets);
    try {
      const rollTx = await roulette.rollBets(betsForContract, `${random32()}`, ..._signatureParams);
      setLoading(true);
      const {events} = await rollTx.wait(1);
      const betRequestEvent = events.find((e: Web3Event) => e.event === 'BetRequest');
      const betResultEvent = events.find((e: Web3Event) => e.event === 'BetResult');
      if (betRequestEvent) {
        setRequestId(betRequestEvent['args']['requestId']);
        dispatch(updateNetwork(web3React));
      }
      if (betResultEvent) {
        closeModal();
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [web3React, bets]);

  useEffect(() => {
    if (web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      roulette.on('BetResult', (_requestId: string) => {
        if (requestId === _requestId) closeModal();
        dispatch(updateNetwork(web3React));
      });
    }
  }, [web3React.active, requestId]);

  return (
    <Dialog open={opened} onCloseModal={closeModal} className="RollDialog__container" animation={animation}>
      <div className="RollDialog">
        <div className="RollDialog__top-area">
          <div className="RollDialog__title">Confirm Roll</div>
          <div className="RollDialog__bets">
            {bets.map((bet) => (
              <div className="RollDialog__bet" key={`rolldialog-bet-${bet.type}-${bet.value}-${bet.id}`}>
                <div className="RollDialog__bet-amount">{bet.amount.toFixed(2)} {BET_TOKEN}</div>
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
                    Bet Amount
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betAmount.toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Fee
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betFee.toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Total
                  </div>
                  <div className="RollDialog__fee-price highlighted">
                    {`${(betAmount + betFee).toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
              </div>
              <div className="RollDialog__action">
                <ApproveButton
                  label="Roll bets!"
                  amount={totalAmountBN}
                  onError={animate}
                  onSubmit={rollBets}
                  closed={!opened}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default RollDialog;
