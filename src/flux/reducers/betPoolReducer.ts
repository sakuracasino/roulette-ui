import {uniqueId} from 'lodash';
import {ADD_BET, REMOVE_BET} from '../actions/betPoolActions';
import {Bet, BetType} from '../../types.d';

const initalBetPool = [
  {
    id: uniqueId('bet_pooled_'),
    type: BetType.Color,
    value: 0,
    amount: 2.13,
  }
];
let initialState = {
  betPool: initalBetPool,
  history: initalBetPool,
};

export default function betPoolReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case ADD_BET:
      const existingBetIndex = state.betPool.findIndex((bet) => bet.type == payload.type && bet.value == payload.value);
      const bet = {...payload, id: uniqueId('bet_pooled_')}
      return {
        ...state,
        betPool: [
          ...state.betPool.filter((_, index) => index !== existingBetIndex),
          bet,
        ],
        history: [...state.history, bet],
      };
    case REMOVE_BET:
      return {
        ...state,
        betPool: state.betPool.filter((bet) => bet.id !== payload),
      };
  }

  return state;
}
