import { Contract } from '@ethersproject/contracts'

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const Permit = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' }
];

type PermitParams = {
  chainId: number,
  tokenContract: Contract,
  holder: string,
  spender: string,
  expiry: string,
  nonce: string,
};

export const getPermitData = async function ({
  chainId,
  tokenContract,
  holder,
  spender,
  expiry,
  nonce,
}: PermitParams) {
  const name = await tokenContract.name();
  const domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: tokenContract.address
  };
  
  const message = {
    holder,
    spender,
    nonce,
    expiry,
    allowed: true,
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