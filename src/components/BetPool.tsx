import React from 'react';
import classNames from 'classnames';
import BetBadge from './BetBadge';
import {Bet} from '../types.d';

import './BetPool.scss';
import './Dice.scss';

const renderBet = function (validIds: number[], onRemoveClick: (index) => void, bet: Bet, index: number) {
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
        <i className="fas fa-times-circle"></i>
      </div>
    </div>
  );
}

const renderNoBets = () => (
  <div className="BetPool__no-bets">
    No bets
  </div>
);

const BetPool = function (props: {onRemoveClick: (index: number) => void, bets: Bet[], betHistory: Bet[]}) {
  const {bets, betHistory, onRemoveClick} = props;
  const totalBet = bets.reduce((total, bet) => total + bet.amount, 0);
  const validIds = bets.map(bet => bet.id);
  return (
    <div className="BetPool">
      <div className="BetPool__total">
        Total: <span className="BetPool__total-number">${totalBet.toFixed(2)}</span>
      </div>
      <div className="BetPool__bets">
        {betHistory.map(renderBet.bind(this, validIds, onRemoveClick))}
        {bets.length ? null : renderNoBets()}
      </div>
      {bets.length ? <button className="BetPool__roll">
        Roll
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
      </button> : null}
    </div>
  )
};

export default BetPool;