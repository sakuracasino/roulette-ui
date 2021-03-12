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
      />
    </div>
  );
};

export default BetPage;
