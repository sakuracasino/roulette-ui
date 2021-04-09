export enum BetType {
  Number,
  Color,
  Even,
  Column,
  Dozen,
  Half,
}

export interface BetCell {
  type: BetType;
  value: number;
  id?: string;
}

export interface Bet extends BetCell {
  amount: number;
}

export interface BetCellGraphic extends BetCell {
  shape: string,
  coords: number[],
  strokeColor?: string,
}

export interface Network {
  name: string;
  chainId: number;
  network_id: number;
  network: string;
  dai_address: string;
  contract_address: string;
}