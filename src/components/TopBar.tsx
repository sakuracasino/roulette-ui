import React from 'react';

import RouletteLogo from '../assets/roulette-logo.svg';

import './TopBar.scss';
export default function TopBar() {
  return (
    <div className="TopBar">
      <div className="TopBar__left-menu">
        <img className="TopBar__logo" src={RouletteLogo} />
        <ul className="TopBar__menu">
          <li className="active">Bet</li>
          <li>Pool</li>
        </ul>
      </div>
      <div className="TopBar__right-menu">
        <button>Connect to a wallet</button>
      </div>
    </div>
  );
};