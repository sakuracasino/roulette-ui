import React, { useState, useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import BigButton from './BigButton';
import Message from './Message';
import NetworkHelper from '../libs/NetworkHelper';
import './ApproveButton.scss';
import classNames from 'classnames';

type ApproveButtonProps = {
  label: string,
  amount: BigNumber,
  closed: boolean,
  onSubmit: (singature: any[]) => void,
  onError: (error: string) => void,
};

const getErrorMessage = (error: {message: string, code: number}) => {
  switch(error.code) {
    case 4001:
      return 'Signature rejected';
    default:
      return error.message;
  }
}

const ApproveButton = ({label, amount, onSubmit, onError, closed}: ApproveButtonProps) => {
  const [signatureParams, setSignatureParams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const web3React = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (closed) {
      setError('');
      setLoading(false);
      setSignatureParams([]);
    }
  }, [closed]);

  const approve = useCallback(async () => {
    const networkHelper = new NetworkHelper(web3React);
    setLoading(true);
    try {
      const _signatureParams = await networkHelper.approveTokenAmount(amount);
      setSignatureParams(_signatureParams);
      setLoading(false);
      setError('');
    } catch (_error) {
      const error = getErrorMessage(_error);
      onError(error);
      setError(error);
      setLoading(false);
      setSignatureParams([]);
    }
  }, [web3React, amount, onError]);

  const callSumbit = useCallback(async (_signatureParams) => {
    try {
      setLoading(true);
      setError('');
      await onSubmit(_signatureParams);
    } catch (_error) {
      console.log(_error);
      const error = getErrorMessage(_error);
      onError(error);
      setError(error);
      setLoading(false);
      setSignatureParams([]);
    }
  }, [onSubmit]);

  const classes = classNames({
    'ApproveButton': true,
    'ApproveButton--approved': !amount.isZero() && signatureParams.length
  });

  return (
    <div>
      {error ? <Message type="error">{error}</Message> : null}
      <BigButton
        className={classes}
        loading={loading}
        disabled={amount.isZero()}
        onClick={() => signatureParams.length ? callSumbit(signatureParams) : approve()}>
        {
          amount.isZero() ?
            'Enter an amount' :
            signatureParams.length ? label : 'Approve'
        }
      </BigButton>
    </div>
  );
}

export default ApproveButton;