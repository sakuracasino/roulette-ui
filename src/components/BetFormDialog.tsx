import React, { useEffect } from 'react';
import Dialog from './Dialog';
import BetBadge from './BetBadge';
import {Bet, BetCell} from '../types.d';
import {getBetMultiplier} from '../libs/utils';
import './BetFormDialog.scss';
import BigButton from "./BigButton";
import { useState } from 'react';

const BetCellInfo = ({bet}: {bet: BetCell}) => (
  <div className="BetFormDialog__bet-info">
    <div className="BetFormDialog__bet-info__description">
      Betting on <BetBadge bet={bet} />
    </div>
    <div className="BetFormDialog__bet-info__multiplier">
      x{getBetMultiplier(bet)}
    </div>
  </div>
);

type BetFormDialogProps = {
  open: boolean,
  bet: Bet,
  onClose: () => void,
  onBetPlace: (amount: string) => void,
};

const BetFormDialog = (props: BetFormDialogProps) => {
  const {open, bet, onClose, onBetPlace} = props;
  const [inputValue, setInputValue] = useState(`${bet.amount || ''}`);

  useEffect(() => {
    setInputValue(`${bet.amount || ''}`);
  }, [open])

  const betMultiply = getBetMultiplier(bet);
  const betWin = Math.round((Number(inputValue)) * betMultiply * 100) / 100;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      isNaN(Number(value)) ||
      Number(value) < 0 ||
      value.includes(' ')
    ) return;
    setInputValue(value);
  };

  const placeBetDisabled = Number(inputValue || 0) === 0;

  return (
    <Dialog open={open} onCloseModal={onClose}>
      <div className="BetFormDialog">
        <BetCellInfo bet={bet} />
        <label className="BetFormDialog__amount-label">
          <span className="BetFormDialog__amount-label-text">Amount to bet</span>
          <div className="BetFormDialog__amount-input-container">
            <input
              className="BetFormDialog__amount-input"
              type="text"
              placeholder="0.0"
              pattern="^[0-9]*[.]?[0-9]*$"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={e => e.key === 'Enter' && !placeBetDisabled && onBetPlace(inputValue)}/>
            <div className="BetFormDialog__amount-power">
              x{betMultiply}
            </div>
          </div>
        </label>
        <div className="BetFormDialog__expected-win">
          to win
          <span className="BetFormDialog__expected-win-amount">
            ${betWin}
          </span>
        </div>
        <BigButton className="BetFormDialog__place-bet-button" onClick={() => onBetPlace(inputValue)} disabled={placeBetDisabled}>
          {placeBetDisabled ? 'Enter an amount' : 'Place bet'}
        </BigButton>
      </div>
    </Dialog>
  );
}

export default BetFormDialog;