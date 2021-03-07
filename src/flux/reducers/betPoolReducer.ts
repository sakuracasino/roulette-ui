import {ADD_BET, REMOVE_BET} from '../actions/betPoolActions';
import {Bet, BetType} from '../../types.d';

let initialState = {
  betPool: [
    {
      type: BetType.Color,
      value: 0,
      amount: 2.13,
    }
  ],
};

export default function betPoolReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case ADD_BET:
      const existingBetIndex = state.betPool.findIndex((bet) => bet.type == payload.type && bet.value == payload.value);
      return {
        ...state,
        betPool: [
          ...state.betPool.filter((_, index) => index !== existingBetIndex),
          payload,
        ],
      };
    case REMOVE_BET:
      return {
        ...state,
        betPool: state.betPool.filter((_, index) => index !== payload),
      };
  }

  return state;
}
