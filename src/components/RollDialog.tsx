import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../flux/store';
import { toggleRollDialog } from '../flux/slices/betsSlice';
import Dialog from './Dialog';
import BetBadge from './BetBadge';
import BigButton from './BigButton';
import { Bet } from '../types';
import RouletteGraphic from './RouletteGraphic';
import config from '../config';

import './RollDialog.scss';
const RollDialog = () => {
  const dispatch = useDispatch();
  const bets: Bet[] = useSelector((state: AppState) => state.bets.betPool);
  const opened: boolean = useSelector((state: AppState) => state.bets.rollDialogDisplayed);
  const betAmount = bets.reduce((total, bet) => total + bet.amount, 0);
  const betFee = 0.10;

  return (
    <Dialog open={opened} onCloseModal={() => dispatch(toggleRollDialog(false))} className="RollDialog__container">
      <div className="RollDialog">
        <div className="RollDialog__top-area">
          <div className="RollDialog__title">Confirm Roll</div>
          <div className="RollDialog__bets">
            {bets.map((bet) => (
              <div className="RollDialog__bet">
                <div className="RollDialog__bet-amount">{bet.amount.toFixed(2)} {config.BET_TOKEN}</div>
                <div className="RollDialog__bet-badge">
                  <BetBadge bet={bet} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="RollDialog__bottom-area">
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
            <BigButton className="BetFormDialog__place-bet-button">
              Confirm Roll
            </BigButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RollDialog;
