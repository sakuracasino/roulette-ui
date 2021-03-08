import {BetCell, BetType} from '../types.d';

export const getBetDescription = (bet: BetCell): string => {
  const description = {
    [BetType.Number]: `${bet.value}`,
    [BetType.Color]: bet.value ? 'Black' : 'Red',
    [BetType.Even]: bet.value ? 'Odd' : 'Even',
    [BetType.Column]: ['3rd Column', '1st Column', '2nd Column'][bet.value],
    [BetType.Dozen]: ['1st Dozen', '2nd Dozen', '3rd Dozen'][bet.value],
    [BetType.Half]: ['From 1 to 18', 'From 19 to 36'][bet.value],
  }[bet.type];

  return description;
}

export const getBetMultiplier = (bet: BetCell): number => {
  return {
    [BetType.Number]: 36,
    [BetType.Color]: 2,
    [BetType.Even]: 2,
    [BetType.Half]: 2,
    [BetType.Column]: 3,
    [BetType.Dozen]: 3,
  }[bet.type];
}

export const getBetColor = (bet: BetCell): string => {
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
  ];
  switch (bet.type) {
    case BetType.Number:
      if (!bet.value) return 'green';
      return redNumbers.includes(Number(bet.value)) ? 'red' : 'black';
    case BetType.Color:
      return bet.value ? 'black' : 'red';
    default:
      return 'gray'
  }
}