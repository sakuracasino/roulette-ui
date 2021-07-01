const INFURA_KEY = '082736a20e224d5ba41350cef02a7d45';

export enum ChainId {
  MAINNET = 1,
  KOVAN = 42,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
};

export const NETWORK_LABELS: { [chainId in ChainId | number]: string } = {
  [ChainId.MAINNET]: 'Mainnet',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.POLYGON_MAINNET]: 'Polygon (Matic)',
  [ChainId.POLYGON_TESTNET]: 'Polygon Testnet (Mumbai)',
}

export const NETWORK_URLS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [ChainId.POLYGON_MAINNET]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  [ChainId.POLYGON_TESTNET]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
};

export const NETWORK_EXPLORERS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: `https://etherscan.io/`,
  [ChainId.KOVAN]: `https://kovan.etherscan.io/`,
  [ChainId.POLYGON_MAINNET]: `https://polygonscan.com/`,
  [ChainId.POLYGON_TESTNET]: `https://mumbai.polygonscan.com/`,
};

export const NETWORK_EXPLORERS_API_URLS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: `https://api.etherscan.io/api`,
  [ChainId.KOVAN]: `https://api-kovan.etherscan.io/api`,
  [ChainId.POLYGON_MAINNET]: `https://api.polygonscan.com/api`,
  [ChainId.POLYGON_TESTNET]: `https://api-testnet.polygonscan.com/api`,
};

export const NETWORK_EXPLORERS_API_KEYS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: ``,
  [ChainId.KOVAN]: `YD1JA383X4AB8TRJYI33TUKC3YR3K4S3Q1`,
  [ChainId.POLYGON_MAINNET]: `CVNRN2FERNHKYHQ6JBU5TXU24WFPYYK6ZG`,
  [ChainId.POLYGON_TESTNET]: `CVNRN2FERNHKYHQ6JBU5TXU24WFPYYK6ZG`,
};