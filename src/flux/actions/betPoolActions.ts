export const ADD_BET = 'ADD_BET'
export const REMOVE_BET = 'REMOVE_BET'

export const addBet = (bet) => ({
  type: ADD_BET,
  payload: bet,
});

export const removeBet = (index) => ({
  type: REMOVE_BET,
  payload: index,
});