import { connect } from 'react-redux';
import BetPage from '../components/BetPage';
import { Bet } from '../types';
import {
  addBet,
  removeBet,
  showPayouts,
  hidePayouts,
} from '../flux/actions/betPoolActions';

const mapStateToProps = ({bets}) => {
  return {
    bets: bets.betPool,
    betHistory: bets.history,
    displayPayouts: bets.displayPayouts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBet: (bet: Bet) => dispatch(addBet(bet)),
    removeBet: (index: number) => dispatch(removeBet(index)),
    showPayouts: () => dispatch(showPayouts()),
    hidePayouts: () => dispatch(hidePayouts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BetPage);
