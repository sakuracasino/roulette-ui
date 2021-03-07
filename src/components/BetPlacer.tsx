import React, {useState} from 'react';

import BetPool from './BetPool';
import BetLayout from './BetLayout';
import Dialog from './Dialog';
import {BetCell, BetType} from '../types.d';

import './BetPlacer.scss';
const BetPlacer = function ({bets, onRemoveBet, onAddBet}) {

  const [betFormOpened, setBetFormOpened] = useState(false);
  const [betFormCell, setBetFormCell] = useState({value: 0, type: BetType.Number});

  const onOpenBetForm = (cell: BetCell) => {
    setBetFormCell(cell);
    setBetFormOpened(true);
  };
  const onCloseBetForm = () => setBetFormOpened(false);

  return (
    <div className="BetPlacer">
      <div className="BetPlacer__bet-pool">
        <BetPool bets={bets} onRemoveClick={onRemoveBet}/>
      </div>
      <div className="BetPlacer__bet-layout">
        <BetLayout bets={bets} onCellClick={onOpenBetForm}/>
      </div>
      <Dialog open={betFormOpened} onCloseModal={onCloseBetForm}>
        <div className="BetPlacer__dialog">
          {betFormCell.type}
          <br />
          {betFormCell.value}
          <input type="text"/>
          <button>Place bet</button>
        </div>
      </Dialog>
    </div>
  );
};

export default BetPlacer;
