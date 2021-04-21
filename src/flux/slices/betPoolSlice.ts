import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { Bet, BetType } from '../../types.d';

const initialBetPool: Bet[] = [];

type BetPoolReducerStateType = {
  bets: Bet[];
  history: Bet[];
  payoutsDisplayed: boolean;
  rollDialogDisplayed: boolean;
};

const initialState: BetPoolReducerStateType = {
  bets: initialBetPool,
  history: initialBetPool,
  payoutsDisplayed: false,
  rollDialogDisplayed: false,
};

const betPoolSlice = createSlice({
  name: 'betPool',
  initialState,
  reducers: {
    addBet(state: BetPoolReducerStateType, { payload }: PayloadAction<Bet>) {
      const existingBetIndex = state.bets.findIndex((bet) => bet.type === payload.type && bet.value === payload.value);
      const bet = { ...payload, id: uniqueId('bet_pooled_') };
      return {
        ...state,
        bets: [
          ...state.bets.filter((_, index) => index !== existingBetIndex),
          bet,
        ],
        history: [...state.history, bet],
      };
    },
    removeBet(state: BetPoolReducerStateType, { payload }: PayloadAction<string>) {
      return {
        ...state,
        bets: state.bets.filter((bet) => bet.id !== payload),
      };
    },
    clearBets(state: BetPoolReducerStateType) {
      return {
        ...state,
        bets: [],
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
} = betPoolSlice.actions;
export default betPoolSlice.reducer;