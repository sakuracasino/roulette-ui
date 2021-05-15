import React from 'react';
import Dialog from './Dialog';
import NumberInput from './NumberInput';
import './PoolPage.scss'
const BET_TOKEN = process.env.BET_TOKEN_NAME || 'DAI';

const AddLiquidityDialog = function () {
  return (
    <Dialog open={true} onCloseModal={() => console.log('closed')}>
      <div className="PoolPage__add-dialog">
        Add liquidity
        <NumberInput labelText="Amount" value="" />
      </div>
    </Dialog>
  )
};

const PoolPage = function () {
  return (
    <div className="PoolPage">
      <div className="LiquidityBlock__container">
        <div className="LiquidityBlock">
            <div className="LiquidityBlock__info-table">
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Your staked <span className="staked-token">{BET_TOKEN}</span></div>
                <div className="LiquidityBlock__value">123.32</div>
              </div>
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Your pool share</div>
                <div className="LiquidityBlock__value">22.31%</div>
              </div>
            </div>
            <div className="LiquidityBlock__actions">
              <button>Add Liquidity</button>
              <button>Remove Liquidity</button>
            </div>
        </div>
      </div>
      <AddLiquidityDialog />
    </div>
  );
};

export default PoolPage;