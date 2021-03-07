import React from 'react';
import Dialog from './Dialog';

import './BetFormDialog.scss';
const BetFormDialog = (props) => {
  const {open, bet, onInputChange, onClose, onBetPlace} = props;
  return (
    <Dialog open={open} onCloseModal={onClose}>
      <div className="BetFormDialog">
        {bet.type}
        <br />
        {bet.value}
        <label className="BetFormDialog__amount-label">
          <span className="BetFormDialog__amount-label-text">Amount to bet</span>
          <div className="BetFormDialog__amount-input-container">
            <input
              className="BetFormDialog__amount-input"
              type="text"
              placeholder="0.0"
              pattern="^[0-9]*[.,]?[0-9]*$"
              value={bet.amount || ''}
              onChange={onInputChange}/>
          </div>
        </label>
        <button onClick={onBetPlace}>Place bet</button>
      </div>
    </Dialog>
  );
}

export default BetFormDialog;