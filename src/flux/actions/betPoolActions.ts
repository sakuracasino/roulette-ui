import { Bet } from "../../types.d";

export const ADD_BET = 'ADD_BET'
export const REMOVE_BET = 'REMOVE_BET'

export const addBet = (bet: Bet) => ({
  type: ADD_BET,
  payload: bet,
});

export const removeBet = (index: number) => ({
  type: REMOVE_BET,
  payload: index,
});