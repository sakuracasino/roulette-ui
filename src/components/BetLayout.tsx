import React from 'react';
import classNames from 'classnames';
//@ts-ignore
import ImageMapper from 'react-image-mapper'; 
import { useSelector, useDispatch } from 'react-redux'

//@ts-ignore
import BetTable from '../assets/bet-table.jpg';
import {getBetSetPayouts} from '../libs/utils';
import {Bet, BetCell, BetCellGraphic, BetType,} from '../types.d';
import './BetLayout.scss';
import { AppState } from '../flux/store';
import { togglePayouts } from '../flux/slices/betsSlice';

const REFERENCE_WIDTH = 600;
const REFERENCE_HEIGHT = 429;
const REFERENCE_Y_RELATION = REFERENCE_HEIGHT / REFERENCE_WIDTH;

function getNumberCellAreas(): BetCellGraphic[] {
  const number1CellPosition: number[] = [72.3,165.5,111,241];
  const width: number = number1CellPosition[2] - number1CellPosition[0];
  const height: number = number1CellPosition[3] - number1CellPosition[1];
  const areas = [];

  for(let x = 0; x < 12; x++) {
    for(let y = 0; y < 3; y++) {
      areas.push({
        type: BetType.Number,
        value: 3 * x + y + 1,
        coords: [
          number1CellPosition[0] + width * x,
          number1CellPosition[1] - height * y,
          number1CellPosition[2] + width * x,
          number1CellPosition[3] - height * y,
        ],
        shape: "rect",
      });
    }
  }

  return areas;
}

function getModuloCellAreas(): BetCellGraphic[] {
  const modulo0CellPosition: number[] = [537,15,576,90];
  const height: number = modulo0CellPosition[3] - modulo0CellPosition[1];
  const areas = [];

  for (let i = 0; i < 3; i++) {
    areas.push({
      type: BetType.Column,
      value: (3-i)%3,
      coords: [
        modulo0CellPosition[0],
        modulo0CellPosition[1] + height * i,
        modulo0CellPosition[2],
        modulo0CellPosition[3] + height * i,
      ],
      shape: 'rect',
    });
  }

  return areas;
}

function getCellMap(width: number): {name: string, areas: BetCellGraphic[]} {
  return {
    name: 'cell-map',
    areas: [
      ...getNumberCellAreas(),
      ...getModuloCellAreas(),
      {
        type: BetType.Number,
        value: 0,
        shape: "poly",
        coords: [20.5,129,52,14,72,14,72,241.5,52,241.5]
      },
      {
        type: BetType.Dozen,
        value: 0,
        shape: "rect",
        coords: [86,256,212,303]
      },
      {
        type: BetType.Dozen,
        value: 1,
        shape: "rect",
        coords: [241,256,367,303]
      },
      {
        type: BetType.Dozen,
        value: 2,
        shape: "rect",
        coords: [396,256,522,303]
      },
      {
        type: BetType.Half,
        value: 0,
        shape: "rect",
        coords: [72,318,149,393]
      },
      {
        type: BetType.Half,
        value: 1,
        shape: "rect",
        coords: [460,318,537,393]
      },
      {
        type: BetType.Even,
        value: 0,
        shape: "rect",
        coords: [150,318,227,393]
      },
      {
        type: BetType.Even,
        value: 1,
        shape: "rect",
        coords: [382,318,460,393]
      },
      {
        type: BetType.Color,
        value: 0,
        shape: "rect",
        coords: [227,318,305,393]
      },
      {
        type: BetType.Color,
        value: 1,
        shape: "rect",
        coords: [306,318,382,393]
      },
    ].map(
      area => {
        return {
          ...area,
          coords: area.coords.map((coord, index) => {
            return index % 2 ?
              coord * width * REFERENCE_Y_RELATION / REFERENCE_HEIGHT :
              coord * width / REFERENCE_WIDTH;
          }),
          strokeColor: "blue",
        }
      }
    ),
  }
};

const renderPayout = (payout: number): string => {
  let result = payout > 0 ? '+' : '';

  if (Math.abs(payout) >= 100000) {
    result += `${Number((payout / 1000).toFixed(0))}k`;
  } else if (Math.abs(payout) >= 10000) {
    result += `${Number((payout / 1000).toFixed(1))}k`;
  } else if (Math.abs(payout) >= 1000) {
    result += `${Number((payout / 1000).toFixed(2))}k`;
  } else {
    result += Number(payout.toFixed(2));
  }

  return result;
};

type BetLayoutMenuProps = {
  payoutsDisplayed: boolean,
  tooglePayouts: (payload: boolean) => void
};

const BetLayoutMenu = ({ payoutsDisplayed, tooglePayouts }: BetLayoutMenuProps) => (
  <ul className="BetLayout__menu">
    <li
      className={classNames({ 'BetLayout__menu-item': true, 'selected': !payoutsDisplayed })}
      onClick={() => tooglePayouts(false)}
    >
      Bets
    </li>
    <li
      className={classNames({ 'BetLayout__menu-item': true, 'selected': payoutsDisplayed })}
      onClick={() => tooglePayouts(true)}
    >
      Possible outcomes
    </li>
  </ul>
);

const renderNumberArea = (
  payouts: number[],
  totalBet: number,
  minPayout: number,
  maxPayout: number,
  area: BetCellGraphic,
  index: number
): JSX.Element => {
  const payout = payouts[area.value];
  let height = Math.abs(area.coords[2] - area.coords[0]);
  let width = Math.abs(area.coords[3] - area.coords[1]);
  let opacity = (payout > 0 ? payout / maxPayout : payout / minPayout) || 0;
  let color = (payout > 0 ? 'green' : '#d81617');
  let top = area.coords[1] + height / 2;
  let left = area.coords[0] - height / 2;
  if (area.value === 0) {
    height = Math.abs(area.coords[4] - area.coords[0]);
    width = Math.abs(area.coords[7] - area.coords[3]);
    top = area.coords[1] - height / 2;
    left = area.coords[0] - width / 2 + height / 2;
  }
  if (opacity < 0.4) {
    opacity = 0.5;
    color = 'darkgray';
  }
  return (
    <div
      className="BetLayout__payout"
      key={`bet-outcome__${index}`}
      style={{
        width,
        height,
        top,
        left,
        lineHeight: `${height}px`,
        color,
        opacity,
      }}
    >
      {Math.abs(payout + totalBet) < 0.01 ? 'LOSE' : renderPayout(payout)}
    </div>
  );
};

type BetLayoutProps = {
  imgWidth: number,
  onCellClick: (cell: BetCell) => void,
};

const BetLayout = ({
  imgWidth,
  onCellClick,
}: BetLayoutProps) => {
  const dispatch = useDispatch();
  const bets: Bet[] = useSelector((state: AppState) => state.bets.betPool);
  const payoutsDisplayed: boolean = useSelector((state: AppState) => state.bets.payoutsDisplayed);
  const onPayoutMenuClick = (payload: boolean) => dispatch(togglePayouts(payload));

  const map = getCellMap(imgWidth);
  const numberAreas = bets.length ? map.areas.filter(x => x.type === BetType.Number).sort((a, b) => a.value - b.value) : [];
  const totalBet = bets.reduce((r, bet) => r + bet.amount, 0);
  const payouts = getBetSetPayouts(bets);
  const maxPayout = payouts.reduce((r, payout) => Math.max(r, payout), 0);
  const minPayout = payouts.reduce((r, payout) => Math.min(r, payout), Infinity);
  const classes = classNames({
    'BetLayout': true,
    'BetLayout--payouts': payoutsDisplayed,
  });

  return (
    <div className={classes}>
      <BetLayoutMenu
        payoutsDisplayed={payoutsDisplayed}
        tooglePayouts={onPayoutMenuClick}
      />
      <div className="BetLayout__layout">
        {payoutsDisplayed ? numberAreas.map(renderNumberArea.bind(this, payouts, totalBet, minPayout, maxPayout)) : null}
        {
          !payoutsDisplayed
            ? <ImageMapper
                width={imgWidth}
                src={BetTable}
                map={map}
                onClick={onCellClick}
              />
            : <img src={BetTable} width={imgWidth} />
        }
      </div>
    </div>
  );
};

BetLayout.defaultProps = {
  imgWidth: 600,
};

export default BetLayout;
