import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import classNames from 'classnames';

import NetworkHelper from '../libs/NetworkHelper';
import { AppState } from '../flux/store';
import { toggleRollDialog } from '../flux/slices/betPoolSlice';
import { updateNetwork } from '../flux/slices/networkSlice';
import { Bet } from '../types';
import { random32 } from '../libs/utils';

import Dialog from './Dialog';
import BetBadge from './BetBadge';
import BigButton from './BigButton';
import Message from './Message';
import RouletteGraphic from './RouletteGraphic';

const BET_TOKEN = process.env.BET_TOKEN_NAME || 'DAI';

type Web3Event = {
  event: string,
  args: object,
};

const getErrorMessage = (error: {message: string, code: number}) => {
  switch(error.code) {
    case 4001:
      return 'Signature rejected';
    default:
      return error.message;
  }
}

import './RollDialog.scss';

const RollDialog = () => {
  const dispatch = useDispatch();
  const bets: Bet[] = useSelector((state: AppState) => state.betPool.bets);
  const opened: boolean = useSelector((state: AppState) => state.betPool.rollDialogDisplayed);
  const betAmount = bets.reduce((total, bet) => total + bet.amount, 0);
  const web3React = useWeb3React<Web3Provider>();
  const [shakeAnimation, setShakeAnimation] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [signatureParams, setSignatureParams] = useState<any[]>([]);
  const [requestId, setRequestId] = useState<string>('');
  const closeModal = () => {
    setError('');
    setLoading(false);
    setLoadingButton(false);
    setSignatureParams([]);
    dispatch(toggleRollDialog(false));
  };
  const betFee = 0.10; // TODO: Replace with contract value

  const approveRoll = useCallback(async () => {
    const networkHelper = new NetworkHelper(web3React);
    const betsForContract = networkHelper.getBetsForContract(bets);
    const totalAmountBN = betsForContract.reduce(
      (amount, bet) => amount.add(BigNumber.from(bet.amount)),
      BigNumber.from('0')
    );
    setLoadingButton(true);
    try {
      const _signatureParams = await networkHelper.approveTokenAmount(totalAmountBN);
      setSignatureParams(_signatureParams);
      setLoadingButton(false);
      setError('');
    } catch (error) {
      setShakeAnimation(true);
      setError(getErrorMessage(error));
      setLoadingButton(false);
    }
  }, [web3React, bets]);

  const rollBets = useCallback(async (_signatureParams) => {
    const networkHelper = new NetworkHelper(web3React);
    const roulette = networkHelper.getRouletteContract();
    const betsForContract = networkHelper.getBetsForContract(bets);
    try {
      setLoadingButton(true);
      const rollTx = await roulette.rollBets(betsForContract, `${random32()}`, ..._signatureParams);
      setLoading(true);
      await new Promise(r => setTimeout(r, 2000)); // TODO: sleep 2 sec, remove
      const {events} = await rollTx.wait(1);
      const betRequestEvent = events.find((e: Web3Event) => e.event === 'BetRequest');
      const betResultEvent = events.find((e: Web3Event) => e.event === 'BetResult');
      if(betRequestEvent) {
        setRequestId(betRequestEvent['args']['requestId']);
        dispatch(updateNetwork(web3React));
      }
      if(betResultEvent) {
        closeModal();
      }
      setError('');
    } catch (error) {
      setShakeAnimation(true);
      setError(getErrorMessage(error));
      setLoading(false);
      setLoadingButton(false);
      setSignatureParams([]);
    }
  }, [web3React, bets]);

  useEffect(() => {
    if(web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const roulette = networkHelper.getRouletteContract();
      roulette.on('BetResult', (_requestId: string) => {
        if (requestId === _requestId) closeModal();
        dispatch(updateNetwork(web3React));
      });
    }
  }, [web3React.active]);

  const containerClass = classNames({
    'RollDialog__container': true,
    'RollDialog__container--shake': error && shakeAnimation,
  });

  const removeAnimation = () => setShakeAnimation(false);
  const onShakeEnd = useCallback(() => {
    const modalElement = document.querySelector('.react-responsive-modal-root');
    modalElement?.removeEventListener('animationend', removeAnimation);
    modalElement?.addEventListener('animationend', removeAnimation);
  }, []);

  return (
    <Dialog open={opened} onCloseModal={closeModal} className={containerClass} onAnimationEnd={onShakeEnd}>
      <div className="RollDialog">
        <div className="RollDialog__top-area">
          <div className="RollDialog__title">Confirm Roll</div>
          <div className="RollDialog__bets">
            {bets.map((bet) => (
              <div className="RollDialog__bet" key={`rolldialog-bet-${bet.type}-${bet.value}-${bet.id}`}>
                <div className="RollDialog__bet-amount">{bet.amount.toFixed(2)} {BET_TOKEN}</div>
                <div className="RollDialog__bet-badge">
                  <BetBadge bet={bet} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="RollDialog__bottom-area">
          {loading ? <RouletteGraphic /> : (
            <>
              <div className="RollDialog__fees">
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Total Price
                  </div>
                  <div className="RollDialog__fee-price highlighted">
                    {`${(betAmount + betFee).toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Bet Amount
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betAmount.toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
                <div className="RollDialog__fee">
                  <div className="RollDialog__fee-description">
                    Bet fee
                  </div>
                  <div className="RollDialog__fee-price">
                    {`${betFee.toFixed(2)} ${BET_TOKEN}`}
                  </div>
                </div>
              </div>
              <div className="RollDialog__action">
                {error ? <Message type="error">{error}</Message> : null}
                <BigButton
                  className="BetFormDialog__place-bet-button"
                  loading={loadingButton}
                  onClick={() => signatureParams.length ? rollBets(signatureParams) : approveRoll()}>
                  {signatureParams.length ? 'Roll bets!' : 'Approve Roll'}
                </BigButton>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default RollDialog;
