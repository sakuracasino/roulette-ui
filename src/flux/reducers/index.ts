import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

const combinedReducers = combineReducers({
  routing: routerReducer,
});

export default combinedReducers;