import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import NetworkHelper from '../../libs/NetworkHelper';

type NetworkReducerStateType = {
  account: string;
  alertedRequestIds: {[key: string]: boolean;};
  accountBetHistory: string[];
  accountBalance: number;
  contractLiquidityBalance: number;
  maxBet: number;
};

const initialState: NetworkReducerStateType = {
  account: '',
  alertedRequestIds: {},
  accountBetHistory: [],
  accountBalance: 0,
  contractLiquidityBalance: 0,
  maxBet: Infinity,
};

export const updateNetwork = createAsyncThunk(
  'network/updateNetwork',
  async (web3React: Web3ReactContextInterface<Web3Provider>) => {
    if (web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const rouletteContract = networkHelper.getRouletteContract();
      const balance = await networkHelper.getBetTokenBalance(web3React.account || '');
      const maxBet = Number(networkHelper.fromTokenDecimals((await rouletteContract.getMaxBet())));
      const contractLiquidityBalance = Number(await networkHelper.getBetTokenBalance((rouletteContract.address)));
      return {
        account: web3React.account,
        accountBetHistory: [],
        accountBalance: Number(balance),
        contractLiquidityBalance,
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
    }
  },
  extraReducers: {
    [updateNetwork.fulfilled]: (state: NetworkReducerStateType, action): NetworkReducerStateType => {
      // Add user to the state array
      return {
        ...state,
        account: action.payload.account,
        accountBalance: action.payload.accountBalance,
        contractLiquidityBalance: action.payload.contractLiquidityBalance,
        maxBet: action.payload.maxBet
      }
    }
  }
})


export const {
  visitRequestIdAlert
} = networkSlice.actions;
export default networkSlice.reducer;