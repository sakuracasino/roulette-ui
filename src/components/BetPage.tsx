import React from 'react';

import BetPlacer from './BetPlacer';
import ResultDialog from './ResultDialog';

import './BetPage.scss'
const BetPage = function () {
  return (
    <div className="BetPage">
      <BetPlacer />
      <ResultDialog />
    </div>
  );
};

export default BetPage;
