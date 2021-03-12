import React from 'react';
import classNames from 'classnames';
import BetBadge from './BetBadge';
import {Bet} from '../types.d';

import './BetPool.scss';

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
      <div className="BetPool__total">Total: ${totalBet.toFixed(2)}</div>
      <div className="BetPool__bets">
        {betHistory.map(renderBet.bind(this, validIds, onRemoveClick))}
        {bets.length ? null : renderNoBets()}
      </div>
    </div>
  )
};

export default BetPool;