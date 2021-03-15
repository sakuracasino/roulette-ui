import React, { useState } from 'react';

import BetPool from './BetPool';
import BetLayout from './BetLayout';
import BetFormDialog from './BetFormDialog';
import RollDialog from './RollDialog';

import { BetCell, BetType, Bet } from '../types.d';

import './BetPlacer.scss';

type BetPlacerProps = {
  bets: Bet[],
  betHistory: Bet[],
  onRemoveBet: (index: number) => void,
  onAddBet: (bet: Bet) => void,
  displayPayouts: boolean,
};

const BetPlacer = (props: BetPlacerProps) => {
  const {
    bets,
    betHistory,
    onRemoveBet,
    onAddBet,
    showPayouts,
    hidePayouts,
    displayPayouts,
    displayRollDialog,
    showRollDialog,
    hideRollDialog,
  } = props;
  const [betFormOpened, setBetFormOpened] = useState(false);
  const [betForm, setBetForm] = useState({value: 0, type: BetType.Number, amount: 0});
  const rollDialogOpened = true;

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
        <BetPool
          bets={bets}
          betHistory={betHistory}
          onRemoveClick={onRemoveBet}
          showPayouts={showPayouts}
          onRollClick={showRollDialog}
        />
      </div>
      <div className="BetPlacer__bet-layout">
        <BetLayout
          bets={bets}
          onCellClick={handleCellClick}
          displayPayouts={displayPayouts}
          showPayouts={showPayouts}
          hidePayouts={hidePayouts}
        />
      </div>
      <BetFormDialog
        open={betFormOpened}
        bet={betForm}
        onInputChange={handleAmountChange}
        onBetPlace={() => {
          onAddBet({...betForm, amount: Number(betForm.amount)});
          onCloseBetForm();
        }}
        onClose={onCloseBetForm}
      />
      <RollDialog
        bets={bets}
        opened={displayRollDialog}
        onClose={hideRollDialog}
      />
    </div>
  );
};

export default BetPlacer;
