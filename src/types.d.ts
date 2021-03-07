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
}

export interface Bet extends BetCell {
  amount: number;
}

export interface BetCellGraphic extends BetCell {
  shape: string,
  coords: number[],
  strokeColor?: string,
}