import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { Bet, BetType } from '../../types.d';

const initialBetPool: Bet[] = [
  {
    id: uniqueId('bet_pooled_'),
    type: BetType.Color,
    value: 0,
    amount: 2.13,
  },
  {
    id: uniqueId('bet_pooled_'),
    type: BetType.Half,
    value: 0,
    amount: 4,
  },
];

type BetPoolReducerStateType = {
  betPool: Bet[];
  history: Bet[];
  payoutsDisplayed: boolean;
  rollDialogDisplayed: boolean;
};

const initialState: BetPoolReducerStateType = {
  betPool: initialBetPool,
  history: initialBetPool,
  payoutsDisplayed: false,
  rollDialogDisplayed: false,
};

const betsSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {
    addBet(state: BetPoolReducerStateType, { payload }: PayloadAction<Bet>) {
      const existingBetIndex = state.betPool.findIndex((bet) => bet.type === payload.type && bet.value === payload.value);
      const bet = { ...payload, id: uniqueId('bet_pooled_') };
      return {
        ...state,
        betPool: [
          ...state.betPool.filter((_, index) => index !== existingBetIndex),
          bet,
        ],
        history: [...state.history, bet],
      };
    },
    removeBet(state: BetPoolReducerStateType, { payload }: PayloadAction<string>) {
      return {
        ...state,
        betPool: state.betPool.filter((bet) => bet.id !== payload),
      };
    },
    clearBets(state: BetPoolReducerStateType) {
      return {
        ...state,
        betPool: [],
      };
    },
    togglePayouts(state: BetPoolReducerStateType, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        payoutsDisplayed: payload,
      };
    },
    toggleRollDialog(state: BetPoolReducerStateType, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        rollDialogDisplayed: payload,
      };
    },
  },
})

export const {
  addBet,
  removeBet,
  clearBets,
  togglePayouts,
  toggleRollDialog,
} = betsSlice.actions;
export default betsSlice.reducer;