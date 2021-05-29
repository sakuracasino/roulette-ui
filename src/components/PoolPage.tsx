import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import { AppState } from '../flux/store';
import { updateNetwork } from '../flux/slices/networkSlice';
import ApproveButton from './ApproveButton';
import Dialog, { useDialogAnimation } from './Dialog';
import NumberInput from './NumberInput';
import './PoolPage.scss'
import NetworkHelper from '../libs/NetworkHelper';
const BET_TOKEN = process.env.BET_TOKEN_NAME || 'DAI';

const AddLiquidityDialog = function ({opened, onClose}: {opened: boolean, onClose: () => void}) {
  const dispatch = useDispatch();
  const web3React = useWeb3React<Web3Provider>();
  const [amount, setAmount] = useState('');
  const [animation, animate] = useDialogAnimation();
  const networkHelper = new NetworkHelper(web3React);
  const contractLiquidityBalance: number = useSelector((state: AppState) => state.network.contractLiquidityBalance);

  const amountNull = !Number(amount);
  const amountShare = amountNull ? '0%' : `${(100 * Number(amount) / (Number(amount) + contractLiquidityBalance)).toFixed(2)}%`;
  const amountWei = networkHelper.toTokenDecimals(Number(amount) || 0);

  const addLiquidity = useCallback(async (signatureParams: any[]) => {
    const roulette = networkHelper.getRouletteContract();
    const addLiquidityTx = await roulette.addLiquidity(amountWei, ...signatureParams);
    await addLiquidityTx.wait(1);
    onClose();
    dispatch(updateNetwork(web3React));
  }, [networkHelper, amount, onClose]);

  useEffect(() => {
    if (opened) setAmount('');
  }, [opened]);

  return (
    <Dialog open={opened} onCloseModal={onClose} animation={animation}>
      <div className="AddLiquidityDialog">
        <div className="AddLiquidityDialog__title">Add liquidity</div>
        <NumberInput labelText="Amount" value={amount} onChange={value => setAmount(value)}>{BET_TOKEN}</NumberInput>
        <div className="AddLiquidityDialog__liquidity-share">
          <div className="AddLiquidityDialog__liquidity-share-label">
            Share of Pool
          </div>
          <div className="AddLiquidityDialog__liquidity-share-value">
            {amountShare}
          </div>
        </div>
        <ApproveButton
          label="Add Liquidity"
          amount={amountWei}
          onError={animate}
          closed={!opened}
          onSubmit={addLiquidity}
        />
      </div>
    </Dialog>
  )
};

const PoolPage = function () {
  const [addLiquidityDialogOpened, setAddLiquidityDialogState] = useState(false);
  const contractLiquidityBalance: number = useSelector((state: AppState) => state.network.contractLiquidityBalance);
  return (
    <div className="PoolPage">
      <div className="LiquidityBlock__container">
        <div className="LiquidityBlock">
            <div className="LiquidityBlock__info-table">
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Total staked</div>
                <div className="LiquidityBlock__value">{contractLiquidityBalance.toFixed(2)} <span className="staked-token">{BET_TOKEN}</span></div>
              </div>
              <div className="LiquidityBlock__info">
                <div className="LiquidityBlock__label">Your staked amount</div>
                <div className="LiquidityBlock__value">- <span className="staked-token">{BET_TOKEN}</span></div>
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