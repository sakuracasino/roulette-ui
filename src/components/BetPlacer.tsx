import React, {useState} from 'react';

import BetPool from './BetPool';
import BetLayout from './BetLayout';
import BetFormDialog from './BetFormDialog';

import {BetCell, BetType, Bet} from '../types.d';

import './BetPlacer.scss';

type BetPlacerProps = {
  bets: Bet[];
  onRemoveBet: (index: number) => void;
  onAddBet: (bet: Bet) => void;
}

const BetPlacer = function ({bets, onRemoveBet, onAddBet}: BetPlacerProps) {

  const [betFormOpened, setBetFormOpened] = useState(false);
  const [betForm, setBetForm] = useState({value: 0, type: BetType.Number, amount: 0});

  const onOpenBetForm = (bet: Bet) => {
    setBetForm(bet);
    setBetFormOpened(true);
  };

  const onCloseBetForm = () => setBetFormOpened(false);

  const handleCellClick = (cell: BetCell) => {
    const bet = bets.find(bet => bet.type == cell.type && bet.value == cell.value);
    onOpenBetForm({
      value: cell.value,
      type: cell.type,
      amount: bet ? bet.amount : 0,
    });
  };

  const handleAmountChange = (event) => onOpenBetForm({
    ...betForm,
    amount: event.target.value,
  });

  return (
    <div className="BetPlacer">
      <div className="BetPlacer__bet-pool">
        <BetPool bets={bets} onRemoveClick={onRemoveBet}/>
      </div>
      <div className="BetPlacer__bet-layout">
        <BetLayout bets={bets} onCellClick={handleCellClick}/>
      </div>
      <BetFormDialog 
        open={betFormOpened}
        bet={betForm}
        onInputChange={handleAmountChange}
        onBetPlace={() => {
          onAddBet({...betForm, amount: Number(betForm.amount)});
          onCloseBetForm();
        }}
        onClose={onCloseBetForm} />
    </div>
  );
};

export default BetPlacer;
