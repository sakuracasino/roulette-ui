import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import NetworkHelper from '../../libs/NetworkHelper';

type NetworkReducerStateType = {
  account: string;
  alertedRequestIds: {[key: string]: boolean;};
  accountBetHistory: string[];
  accountBalance: number;
  accountLiquidity: number,
  contractLiquidityBalance: number;
  betFee: number;
  maxBet: number;
};

const initialState: NetworkReducerStateType = {
  account: '',
  alertedRequestIds: {},
  accountBetHistory: [],
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
        accountBetHistory: [],
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
    }
  }
})


export const {
  visitRequestIdAlert
} = networkSlice.actions;
export default networkSlice.reducer;