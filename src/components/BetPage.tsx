import React from 'react';

import BetPlacer from './BetPlacer';

const BetPage = function (props) {
  return (
    <div>
      <BetPlacer
        bets={props.bets}
        betHistory={props.betHistory}
        onAddBet={props.addBet}
        onRemoveBet={props.removeBet}
        displayPayouts={props.displayPayouts}
        showPayouts={props.showPayouts}
        hidePayouts={props.hidePayouts}
        displayRollDialog={props.displayRollDialog}
        showRollDialog={props.showRollDialog}
        hideRollDialog={props.hideRollDialog}
      />
    </div>
  );
};

export default BetPage;
