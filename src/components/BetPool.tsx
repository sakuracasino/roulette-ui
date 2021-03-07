import React from 'react';
import classNames from 'classnames';

import {Bet, BetType} from '../types.d';

import './BetPool.scss';

const renderBet = function (onRemoveClick: (index) => void, bet: Bet, index: number) {
  const betClass = classNames({
    'BetPool__bet': true,
    'BetPool__bet--number': bet.type === BetType.Number,
    'BetPool__bet--color': bet.type === BetType.Color,
    'BetPool__bet--even': bet.type === BetType.Even,
    'BetPool__bet--column': bet.type === BetType.Column,
    'BetPool__bet--dozen': bet.type === BetType.Dozen,
    'BetPool__bet--half': bet.type === BetType.Half,
  });

  const description = {
    [BetType.Number]: bet.value,
    [BetType.Color]: bet.value ? 'Red' : 'Black',
    [BetType.Even]: bet.value ? 'Odd' : 'Even',
    [BetType.Column]: ['1st Column', '2nd Column', '3rd Column'][bet.value],
    [BetType.Dozen]: ['1st Dozen', '2nd Dozen', '3rd Dozen'][bet.value],
    [BetType.Half]: ['From 1 to 18', 'From 19 to 36'][bet.value],
  }[bet.type];

  return (
    <li className={betClass} key={`${index}`}>
      <span className="BetPool__bet__amount">
        ${bet.amount},
      </span>
      <span className="BetPool__bet__description">
        {description}, 
      </span>
      <span className="BetPool__bet__remove" onClick={() => onRemoveClick(index)}>
        x
      </span>
    </li>
  );
}

const BetPool = function (props: {onRemoveClick: (index: number) => void, bets: Bet[]}) {
  const {bets, onRemoveClick} = props;
  const totalBet = bets.reduce((total, bet) => total + bet.amount, 0);
  return (
    <div className="BetPool">
      <div className="BetPool__total">Total: ${totalBet.toFixed(2)}</div>
      <ul className="BetPool__bets">
        {bets.map(renderBet.bind(this, onRemoveClick))}
      </ul>
    </div>
  )
};

export default BetPool;