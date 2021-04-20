import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import NetworkHelper from '../../libs/NetworkHelper';

type NetworkReducerStateType = {
  account: string;
  accountBetHistory: string[];
  accountBalance: number;
  maxBet: number;
};

const initialState: NetworkReducerStateType = {
  account: '',
  accountBetHistory: [],
  accountBalance: 0,
  maxBet: 0,
};

export const updateNetwork = createAsyncThunk(
  'network/updateNetwork',
  async (web3React: Web3ReactContextInterface<Web3Provider>) => {
    if (web3React.active) {
      const networkHelper = new NetworkHelper(web3React);
      const balance = await networkHelper.getBetTokenBalance(web3React.account || '');
      return {
        account: web3React.account,
        accountBetHistory: [],
        accountBalance: Number(balance),
        maxBet: 10,
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
  },
  extraReducers: {
    [updateNetwork.fulfilled]: (state: NetworkReducerStateType, action): NetworkReducerStateType => {
      // Add user to the state array
      return {
        ...state,
        account: action.payload.account,
        accountBalance: action.payload.accountBalance,
      }
    }
  }
})

export default networkSlice.reducer;