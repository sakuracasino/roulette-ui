import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import NetworkHelper from '../../libs/NetworkHelper';
import { RollRequest } from '../../types';

const MAX_STORED_ROLLS = 1000;

type NetworkReducerStateType = {
  account: string;
  alertedRequestIds: {[key: string]: boolean;};
  rollHistory: RollRequest[];
  accountBalance: number;
  accountLiquidity: number;
  contractLiquidityBalance: number;
  betFee: number;
  maxBet: number;
};

const initialState: NetworkReducerStateType = {
  account: '',
  alertedRequestIds: {},
  rollHistory: [],
  accountBalance: 0,
  accountLiquidity: 0,
  contractLiquidityBalance: 0,
  betFee: 0,
  maxBet: Infinity,
};

export const updateNetwork = createAsyncThunk(
  'network/updateNetwork',
  async (web3React: Web3ReactContextInterface<Web3Provider>) => {
    if (web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const rouletteContract = networkHelper.getRouletteContract();
      const balance = await networkHelper.getBetTokenBalance(web3React.account || '');
      const betFee = Number((await networkHelper.getBetFee()));
      const maxBet = Number(networkHelper.fromTokenDecimals((await rouletteContract.getMaxBet())));
      const contractLiquidityBalance = await networkHelper.getRouletteTotalLiquidity();
      const accountLiquidity = await networkHelper.getAddressLiquidity(web3React.account || '');
      return {
        account: web3React.account,
        accountBalance: Number(balance),
        accountLiquidity,
        contractLiquidityBalance,
        betFee,
        maxBet,
      };
    } else {
      return {};
    }
  }
);

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    visitRequestIdAlert(state: NetworkReducerStateType, { payload }: PayloadAction<string>) {
      state.alertedRequestIds[payload] = true;
    },
    addRollRequest(state: NetworkReducerStateType, { payload }: PayloadAction<{requestId: string, address: string}>) {
      const rollHistory = [...state.rollHistory];
      rollHistory.push({
        requestId: payload.requestId,
        address: payload.address,
        randomResult: null,
        payout: null
      });
      let accountRollsLength = rollHistory.filter(roll => roll.address === state.account).length;
      let foreignRollsLength = rollHistory.length - accountRollsLength;

      for(let i = 0; i < rollHistory.length && accountRollsLength > MAX_STORED_ROLLS; i++) {
        if(rollHistory[i].address === state.account) {
          rollHistory.splice(i, 1);
          accountRollsLength--;
        }
      }

      for(let i = 0; i < rollHistory.length && foreignRollsLength > MAX_STORED_ROLLS; i++) {
        if (rollHistory[i].address !== state.account) {
          rollHistory.splice(i, 1);
          foreignRollsLength--;
        }
      }

      return {
        ...state,
        rollHistory,
      };
    },
    updateRollRequest(
      state: NetworkReducerStateType,
      { payload }: PayloadAction<{requestId: string, randomResult: BigNumber, payout: BigNumber}>
    ) {
      const rollRequest = state.rollHistory.find(roll => roll.requestId === payload.requestId);
      if (rollRequest) {
        rollRequest.randomResult = payload.randomResult;
        rollRequest.payout = payload.payout;
      }
      return state;
    }
  },
  extraReducers: {
    [updateNetwork.fulfilled]: (state: NetworkReducerStateType, action): NetworkReducerStateType => {
      return {
        ...state,
        account: action.payload.account,
        accountBalance: action.payload.accountBalance,
        accountLiquidity: action.payload.accountLiquidity,
        contractLiquidityBalance: action.payload.contractLiquidityBalance,
        betFee: action.payload.betFee,
        maxBet: action.payload.maxBet
      }
    },
  }
})


export const {
  visitRequestIdAlert,
  addRollRequest,
  updateRollRequest,
} = networkSlice.actions;
export default networkSlice.reducer;