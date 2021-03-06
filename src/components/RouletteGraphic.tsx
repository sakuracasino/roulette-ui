import React from 'react';
// @ts-ignore
import RouletteBorderImage from '../assets/roulette-border.png';
// @ts-ignore
import RouletteInternalImage from '../assets/roulette-interior.png';

import './RouletteGraphic.scss';
const RouletteGraphic = () => {
  return (
    <div className="roulette-graphic">
      <img className="roulette-graphic__border" src={RouletteBorderImage} />
      <img className="roulette-graphic__interior" src={RouletteInternalImage} />
    </div>
  );
};

export default RouletteGraphic;
