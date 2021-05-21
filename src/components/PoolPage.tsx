import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../flux/store';
import BigButton from './BigButton';
import Dialog from './Dialog';
import NumberInput from './NumberInput';
import './PoolPage.scss'
const BET_TOKEN = process.env.BET_TOKEN_NAME || 'DAI';

const AddLiquidityDialog = function ({opened, onClose}: {opened: boolean, onClose: () => void}) {
  const [amount, setAmount] = useState('');
  const contractLiquidityBalance: number = useSelector((state: AppState) => state.network.contractLiquidityBalance);
  const amountNull = !Number(amount);
  const amountShare = amountNull ? '0%' : `${(100 * Number(amount) / (Number(amount) + contractLiquidityBalance)).toFixed(2)}%`;
  return (
    <Dialog open={opened} onCloseModal={onClose}>
      <div className="AddLiquidityDialog">
        <div className="AddLiquidityDialog__title">Add liquidity</div>
        <NumberInput labelText="Amount" value={amount} onChange={value => setAmount(value)} />
        <div className="AddLiquidityDialog__liquidity-share">
          <div className="AddLiquidityDialog__liquidity-share-label">
            Share of Pool
          </div>
          <div className="AddLiquidityDialog__liquidity-share-value">
            {amountShare}
          </div>
        </div>
        <BigButton disabled={amountNull}>{amountNull ? 'Enter an amount' : 'Add Liquidity'}</BigButton>
      </div>
    </Dialog>
  )
};

const PoolPage = function () {
  const [addLiquidityDialogOpened, setAddLiquidityDialogState] = useState(false);
  return (
    <div className="PoolPage">
      <div className="LiquidityBlock__container">
        <div className="LiquidityBlock">
            <div className="LiquidityBlock__info-table">
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Total staked <span className="staked-token">{BET_TOKEN}</span></div>
                <div className="LiquidityBlock__value">9500.00</div>
              </div>
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Your staked <span className="staked-token">{BET_TOKEN}</span></div>
                <div className="LiquidityBlock__value">-</div>
              </div>
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Your pool share</div>
                <div className="LiquidityBlock__value">-</div>
              </div>
            </div>
            <div className="LiquidityBlock__actions">
              <button onClick={() => setAddLiquidityDialogState(true)}>Add Liquidity</button>
              <button>Remove Liquidity</button>
            </div>
        </div>
      </div>
      <AddLiquidityDialog opened={addLiquidityDialogOpened} onClose={() => setAddLiquidityDialogState(false)}/>
    </div>
  );
};

export default PoolPage;