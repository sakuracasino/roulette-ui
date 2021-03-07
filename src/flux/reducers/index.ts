import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import betPoolReducer from './betPoolReducer';

const combinedReducers = combineReducers({
  routing: routerReducer,
  bets: betPoolReducer,
});

export default combinedReducers;