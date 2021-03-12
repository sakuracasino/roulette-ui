import { Bet, BetCell, BetType } from '../types.d';

const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
];

export const getBetDescription = (bet: BetCell): string => {
  return {
    [BetType.Number]: `${bet.value}`,
    [BetType.Color]: bet.value ? 'Black' : 'Red',
    [BetType.Even]: bet.value ? 'Odd' : 'Even',
    [BetType.Column]: ['3rd Column', '1st Column', '2nd Column'][bet.value],
    [BetType.Dozen]: ['1st Dozen', '2nd Dozen', '3rd Dozen'][bet.value],
    [BetType.Half]: ['From 1 to 18', 'From 19 to 36'][bet.value],
  }[bet.type];
};

export const getBetMultiplier = (bet: BetCell): number => {
  return {
    [BetType.Number]: 36,
    [BetType.Color]: 2,
    [BetType.Even]: 2,
    [BetType.Half]: 2,
    [BetType.Column]: 3,
    [BetType.Dozen]: 3,
  }[bet.type];
};

export const getNumberColor = (value: number|string): number => {
  if (!value) return 2;
  return RED_NUMBERS.includes(Number(value)) ? 0 : 1;
};

export const getBetColor = (bet: BetCell): string => {
  switch (bet.type) {
    case BetType.Number:
      if (!bet.value) return 'green';
      return RED_NUMBERS.includes(Number(bet.value)) ? 'red' : 'black';
    case BetType.Color:
      return bet.value ? 'black' : 'red';
    default:
      return 'gray';
  }
};

export const getBetSetPayouts = (bets: Bet[]) => {
  const totalBetSetAmount = bets.reduce((amount, bet) => amount + bet.amount, 0);
  const payouts: number[] = [];

  for (let result = 0; result < 37; result += 1) {
    let payout = -totalBetSetAmount;

    type BetMatcher = [BetType, (bet: Bet) => boolean];
    const matchingBets: BetMatcher[] = [
      [BetType.Number, (bet: Bet) => bet.value === result],
      [BetType.Color, (bet: Bet) => bet.value === getNumberColor(result)],
      [BetType.Even, (bet: Bet) => bet.value === result % 2],
      [BetType.Half, (bet: Bet) => (bet.value ? (result > 19) : (result <= 19))],
      [BetType.Column, (bet: Bet) => bet.value === result % 3],
      [BetType.Dozen, (bet: Bet) => bet.value * 12 < result && result <= (bet.value + 1) * 12],
    ];

    matchingBets.forEach(([type, matchFn]) => {
      const matchBet = bets.find((bet) => bet.type === type && matchFn(bet));
      if (matchBet) payout += matchBet.amount * getBetMultiplier(matchBet);
    });

    payouts.push(payout);
  }

  return payouts;
};
