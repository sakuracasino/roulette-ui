import React from 'react';
import Dialog from './Dialog';
import BetBadge from './BetBadge';
import {Bet, BetCell} from '../types.d';
import {getBetMultiplier} from '../libs/utils';
import './BetFormDialog.scss';
import BigButton from "./BigButton";

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
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onClose: () => void,
  onBetPlace: () => void,
};

const BetFormDialog = (props: BetFormDialogProps) => {
  const {open, bet, onInputChange, onClose, onBetPlace} = props;

  const betMultiply = getBetMultiplier(bet);
  const betWin = Math.round((bet.amount || 0) * betMultiply * 100) / 100;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      isNaN(Number(value)) ||
      Number(value) < 0 ||
      value.includes(' ')
    ) return;
    onInputChange(event);
  };

  const placeBetDisabled = Number(bet.amount) === 0;

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
              value={bet.amount || ''}
              onChange={handleInputChange}
              onKeyDown={e => e.key === 'Enter' && !placeBetDisabled && onBetPlace()}/>
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
        <BigButton className="BetFormDialog__place-bet-button" onClick={() => onBetPlace()} disabled={placeBetDisabled}>
          {placeBetDisabled ? 'Enter an amount' : 'Place bet'}
        </BigButton>
      </div>
    </Dialog>
  );
}

export default BetFormDialog;