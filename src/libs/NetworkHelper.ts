// @ts-ignore
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
    "dai_address": "0xa830eC49F511F16b6020652CCf3d0690AB903a08",
    "contract_address": "0xB328274b98E39931e0a90cD0471383C7c0a7EF73",
  }
];

export type RollLog = {
  requestId: string,
  sender: string,
  completed: boolean,
  randomResult?: number,
  payout?: number,
};

const contracts = new Map();

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
    const contractHash = `${network.dai_address}-${this.account || ''}`;
    if (!contracts.get(contractHash)) {
      contracts.set(contractHash, new Contract(
        network.dai_address,
        ERC20_PERMIT,
        this.web3React.library?.getSigner(this.account || ''),
      ));
    }
    return contracts.get(contractHash);
  }

  public getRouletteContract() {
    const network = this.getNetwork();
    const contractHash = `${network.contract_address}-${this.account || ''}`;
    if (!contracts.get(contractHash)) {
      contracts.set(contractHash, new Contract(
        network.contract_address,
        rouletteAbi,
        this.web3React.library?.getSigner(this.account || ''),
      ));
    }
    return contracts.get(contractHash);
  }

  async getRollHistory(): Promise<RollLog[]> {
    const roulette = await this.getRouletteContract();
    const betRequestHistory = await roulette.queryFilter('BetRequest');
    const betResults = (
      await roulette.queryFilter('BetResult')
    ).reduce((results: any, betRequest: {args: {requestId: string, randomResult: BigNumber, payout: BigNumber}}) => {
      results[betRequest.args.requestId] = {
        randomResult: betRequest.args.randomResult.toString(),
        payout: formatEther(betRequest.args.payout),
      };
      return results;
    }, {});
    const betHistory: RollLog[] = betRequestHistory.map((betRequest: {args: {requestId: string, sender: string}}) => {
      return {
        requestId: betRequest.args.requestId,
        sender: betRequest.args.sender,
        completed: !!betResults[betRequest.args.requestId],
        ...(betResults[betRequest.args.requestId] || {})
      };
    });
    return betHistory;
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

  public async approveTokenAmount(amount: BigNumber): Promise<any[]> {
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

