import React from 'react';
import ImageMapper from 'react-image-mapper';

//@ts-ignore
import BetTable from '../assets/bet-table.jpg';
import { Bet, BetCell, BetCellGraphic, BetType } from '../types.d';

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
}

const BetLayout = function ({bets, imgWidth, onCellClick}: {bets: Bet[], imgWidth: number, onCellClick: (cell: BetCell) => void}) {
  return (
    <div>
      <ImageMapper
        width={imgWidth}
        src={BetTable}
        map={getCellMap(imgWidth)}
        onClick={onCellClick}
        onImageClick={(e) => console.log(e.clientX-e.target.getBoundingClientRect().left, e.clientY-e.target.getBoundingClientRect().top)}
        />
    </div>
  );
};

BetLayout.defaultProps = {
  imgWidth: 600
};

export default BetLayout;
