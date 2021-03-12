import {connect} from 'react-redux';
import {addBet, removeBet} from '../flux/actions/betPoolActions';
import BetPage from '../components/BetPage';

const mapStateToProps = ({bets}) => {
  return {
    bets: bets.betPool,
    betHistory: bets.history,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBet: (bet) => {
      return dispatch(addBet(bet));
    },
    removeBet: (index) => {
      return dispatch(removeBet(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BetPage);
