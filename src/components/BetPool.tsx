import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux'
import { compact } from 'lodash';

import { AppState } from '../flux/store';
import { removeBet, toggleRollDialog, togglePayouts } from '../flux/slices/betPoolSlice';
import { Bet } from '../types.d';
import { getBetSetPayouts } from '../libs/utils';
import BetBadge from './BetBadge';

import './BetPool.scss';
import './Dice.scss';

const renderBet = function (validIds: string[], onRemoveClick: (id: string) => any, bet: Bet, index: number) {
  const betClass = classNames({
    'BetPool__bet': true,
    'BetPool__bet--hidden': !validIds.includes(bet.id),
  });

  return (
    <div className={betClass} key={`${index}`}>
      <div className="BetPool__bet__amount">
        ${bet.amount}
      </div>
      <div className="BetPool__bet__description">
        <BetBadge bet={bet} />
      </div>
      <div className="BetPool__bet__remove" onClick={() => onRemoveClick(bet.id)}>
        <i className="fas fa-times-circle" />
      </div>
    </div>
  );
};

const renderNoBets = () => (
  <div className="BetPool__no-bets">
    No bets
  </div>
);

const Dice = () => (
    <div className="BetPool__roll-dice">
        <div id="die-1" className="die">
            <div className="face face-1">
                <div className="dot"></div>
            </div>
            <div className="face face-2">
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <div className="face face-3">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <div className="face face-4">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <div className="face face-5">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <div className="face face-6">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    </div>
);

const BetPool = () => {
  const dispatch = useDispatch();
  const onRemoveClick = (id: string) => dispatch(removeBet(id));
  const onRollClick = () => dispatch(toggleRollDialog(true));
  const onPayoutClick = () => dispatch(togglePayouts(true));

  const bets: Bet[] = useSelector((state: AppState) => state.betPool.bets);
  const betHistory: Bet[] = useSelector((state: AppState) => state.betPool.history);
  const totalBetAmount = bets.reduce((total, bet) => total + bet.amount, 0);
  const maxBetAmount: number = useSelector((state: AppState) => state.network.maxBet);
  const maxWin = getBetSetPayouts(bets).reduce((r, payout) => Math.max(r, payout), 0);
  const validIds = compact(bets.map((bet) => bet.id));
  const maxAmountOverflow: boolean = maxBetAmount < totalBetAmount;
  return (
    <div className="BetPool">
      <div className="BetPool__total">
        <div>
          Total: <span className="BetPool__total-number">${totalBetAmount.toFixed(2)}</span>
        </div>
        <div className="BetPool__max-win">
          Max win:
            <span className="BetPool__max-win-number" onClick={onPayoutClick}>
              +${maxWin.toFixed(2)}
            </span>
        </div>
      </div>
      <div className="BetPool__bets">
        {betHistory.map(renderBet.bind(this, validIds, onRemoveClick))}
        {bets.length ? null : renderNoBets()}
      </div>
      {bets.length ? <button className="BetPool__roll" onClick={maxAmountOverflow ? undefined : onRollClick} disabled={maxAmountOverflow}>
        {maxAmountOverflow ? `Max bet is $${maxBetAmount.toFixed(2)}` : <>Roll <Dice /></>}
      </button> : null}
    </div>
  );
};

export default BetPool;
