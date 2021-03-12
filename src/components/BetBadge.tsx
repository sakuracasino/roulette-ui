import React from 'react';
import {getBetDescription, getBetColor} from '../libs/utils';
import {BetCell} from '../types.d';
import './BetFormDialog.scss';

import './BetBadge.scss';
const BetBadge = ({bet}: {bet: BetCell}) => (
  <span className="BetBadge" data-color={getBetColor(bet)}>
    {getBetDescription(bet)}
  </span>
);

export default BetBadge;