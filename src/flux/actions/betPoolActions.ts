import { Bet } from '../../types.d';

export const ADD_BET = 'ADD_BET';
export const REMOVE_BET = 'REMOVE_BET';
export const CLEAR_BETS = 'CLEAR_BETS';
export const TOGGLE_DISPLAY_PAYOUT = 'TOGGLE_DISPLAY_PAYOUT';

export const addBet = (bet: Bet): { type: string, payload: Bet } => ({
  type: ADD_BET,
  payload: bet,
});

export const removeBet = (index: number): { type: string, payload: number } => ({
  type: REMOVE_BET,
  payload: index,
});

export const clearBets = (): { type: string } => ({
  type: CLEAR_BETS,
});

export const showPayouts = (): { type: string, payload: boolean } => ({
  type: TOGGLE_DISPLAY_PAYOUT,
  payload: true,
});

export const hidePayouts = (): { type: string, payload: boolean } => ({
  type: TOGGLE_DISPLAY_PAYOUT,
  payload: false,
});
