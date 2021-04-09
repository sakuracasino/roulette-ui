import { Contract } from '@ethersproject/contracts'
import { BigNumber } from "@ethersproject/bignumber";

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const Permit = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
];

type PermitParams = {
  chainId: number,
  tokenContract: Contract,
  owner: string,
  spender: string,
  amount: BigNumber,
  deadline: string,
};

export const getPermitData = async function ({
  chainId,
  tokenContract,
  owner,
  spender,
  amount,
  deadline,
}: PermitParams) {
  const nonce = await tokenContract.nonces(owner);
  const name = await tokenContract.name();
  const domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: tokenContract.address
  };
  
  const message = {
    owner,
    spender,
    value: amount.toString(),
    nonce: nonce.toString(),
    deadline,
  };

  const data = JSON.stringify({
    types: {
      EIP712Domain,
      Permit
    },
    domain,
    primaryType: 'Permit',
    message
  });

  return data;
}