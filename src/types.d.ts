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
  id: string;
}

export interface BetCellGraphic extends BetCell {
  shape: string,
  coords: number[],
  strokeColor?: string,
}

export interface Network {
  name: string;
  chain_id: number;
  network_id: number;
  network_name: string;
  bet_token_address: string;
  contract_address: string;
}