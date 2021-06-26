const INFURA_KEY = '082736a20e224d5ba41350cef02a7d45';

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
};
/*
export const NETWORK_LABELS: { [chainId in ChainId | number]: string } = {
  [ChainId.MAINNET]: 'Mainnet',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GOERLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.POLYGON_MAINNET]: 'Polygon (Matic)',
  [ChainId.POLYGON_TESTNET]: 'Polygon Testnet (Mumbai)',
}
*/
export const NETWORK_URLS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [ChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [ChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [ChainId.POLYGON_MAINNET]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  [ChainId.POLYGON_TESTNET]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
};
