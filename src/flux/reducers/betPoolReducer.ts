import { uniqueId } from 'lodash';
import {ADD_BET, CLEAR_BETS, displayPayouts, REMOVE_BET, TOGGLE_DISPLAY_PAYOUT} from '../actions/betPoolActions';
import { Bet, BetType } from '../../types.d';

const initialBetPool: Bet[] = [
  {
    id: uniqueId('bet_pooled_'),
    type: BetType.Color,
    value: 0,
    amount: 2.13,
  },
];

type BetPoolReducerStateType = {
  betPool: Bet[];
  history: Bet[];
  displayPayouts: boolean;
};

const initialState: BetPoolReducerStateType = {
  betPool: initialBetPool,
  history: initialBetPool,
  displayPayouts: false,
};

export default function betPoolReducer(state = initialState, action: string) {
  const {type, payload} = action;

  switch (type) {
    case ADD_BET:
      const existingBetIndex = state.betPool.findIndex((bet) => bet.type == payload.type && bet.value == payload.value);
      const bet = {...payload, id: uniqueId('bet_pooled_')};
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
    case CLEAR_BETS:
      return {
        ...state,
        betPool: state.betPool.filter((bet) => bet.id !== payload),
      };
    case TOGGLE_DISPLAY_PAYOUT:
      return {
        ...state,
        displayPayouts: payload,
      };
  }

  return state;
}
