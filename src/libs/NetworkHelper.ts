import { networks as deployedNetworks, abi as rouletteAbi } from '@sakuracasino/roulette-contract';
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther, parseEther } from '@ethersproject/units';
import { splitSignature } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ERC20_PERMIT } from '../data/abis';
import { Bet, Network } from '../types';
import { getPermitData } from './permit';

// console.log(process.env.NODE_ENV);
// export const networks = process.env.NODE_ENV !== 'development' ? deployedNetworks : [
export const networks = [
  ...deployedNetworks,
  {
    "name": "Ganache",
    "chainId": 1,
    "network_id": 1337,
    "network": "ganache",
    "dai_address": "0xeD3B8ABa34c9537a5a21F643A48a62e238154AF9",
    "contract_address": "0x6e263c8Cb35EF748393AC366301c4478d8Eb0Fc0",
  }
];

export default class NetworkHelper {
  private web3React: Web3ReactContextInterface<Web3Provider>;
  private account: string | null | undefined;
  private chainId: number;
  
  constructor(web3React: Web3ReactContextInterface<Web3Provider>) {
    this.web3React = web3React;
    this.account = web3React.account;
    this.chainId = web3React.chainId || 1;
  }

  public checkActive() {
    if(!this.web3React.active) {
      throw 'web3 provider is inactive';
    }
  }

  public getNetwork(): Network {
    this.checkActive();
    const network = networks.find((network: Network) => network.chainId === this.chainId);
    if (!network) {
      throw `Network with chainId ${this.chainId} not found`;
    }
    return network;
  }

  public getBetTokenContract() {
    const network = this.getNetwork();
    return new Contract(
      network.dai_address,
      ERC20_PERMIT,
      this.web3React.library?.getSigner(this.account || ''),
    );
  }

  public getRouletteContract() {
    const network = this.getNetwork();
    return new Contract(
      network.contract_address,
      rouletteAbi,
      this.web3React.library?.getSigner(this.account || ''),
    );
  }

  public toTokenDecimals(value: number) {
    return parseEther(`${value}`);
  }

  public async getBetTokenBalance(account: string) {
    const tokenContract = this.getBetTokenContract();
    return formatEther((await tokenContract.balanceOf(account)))
  }

  public getBetsForContract(bets: Bet[]) {
    return bets.map((bet: Bet) => ({
      betType: `${bet.type}`,
      value: `${bet.value}`,
      amount: this.toTokenDecimals(bet.amount).toString(),
    }));
  }

  public async approveTokenAmount(amount: BigNumber) {
    const tokenContract = await this.getBetTokenContract();
    const rouletteContract = await this.getRouletteContract();
    const deadline = MaxUint256.toString();
    const data = await getPermitData({
      chainId: this.chainId,
      tokenContract,
      owner: this.account || '',
      spender: rouletteContract.address,
      amount,
      deadline,
    });
    const rawSignature = await this.web3React.library?.send('eth_signTypedData_v4', [this.account, data]);
    const signature = splitSignature(rawSignature);
    return [
      deadline,
      `${signature.v}`,
      signature.r,
      signature.s,
      {from: this.account}
    ];
  }
};

