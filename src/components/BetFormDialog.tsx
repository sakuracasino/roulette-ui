import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import BetBadge from './BetBadge';
import BigButton from './BigButton';
import NumberInput from './NumberInput';
import {getBetMultiplier} from '../libs/utils';
import {Bet, BetCell} from '../types.d';
import './BetFormDialog.scss';

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

  const placeBetDisabled = Number(inputValue || 0) === 0;

  return (
    <Dialog open={open} onCloseModal={onClose}>
      <div className="BetFormDialog">
        <BetCellInfo bet={bet} />
        <NumberInput
          value={inputValue}
          onChange={_value => setInputValue(_value)}
          labelText="Amount to bet"
          onKeyDown={e => e.key === 'Enter' && !placeBetDisabled && onBetPlace(inputValue)}
          >
          <div className="BetFormDialog__amount-power">
            x{betMultiply}
          </div>
        </NumberInput>
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