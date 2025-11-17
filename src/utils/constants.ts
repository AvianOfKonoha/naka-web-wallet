export enum NetworkEnum {
  ETHEREUM = 0,
  GOERLI = 5,
  OPTIMISM = 10,
  BINANCE_SMART_CHAIN = 56,
  BSC = 97,
  POLYGON = 137,
  FANTOM_OPERA = 250,
  MEGA = 6342,
  ARBITRUM = 42151
}

export const NETWORKS = {
  1: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: './img/icons/ethereum-eth-logo.png'
  },
  5: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Goerli Testnet',
    icon: './img/icons/ethereum-eth-logo.png'
  },
  10: {
    id: 'optimistic-ethereum',
    symbol: 'OP',
    name: 'Optimism',
    icon: './img/icons/optimism-ethereum-op-logo.png'
  },
  56: {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'Binance Smart Chain',
    icon: './img/icons/binance-coin-bnb-logo.png'
  },
  97: {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BSC Testnet',
    icon: './img/icons/binance-coin-bnb-logo.png'
  },
  137: {
    id: 'polygon',
    symbol: 'POL',
    name: 'Polygon',
    icon: './img/icons/polygon-matic-logo.png'
  },
  250: {
    id: 'fantom',
    symbol: 'FTM',
    name: 'Fantom Opera',
    icon: './img/icons/fantom-ftm-logo.png'
  },
  6342: {
    id: 'mega', // custom or unknown, fallback name
    symbol: 'MEGA',
    name: 'Mega Testnet',
    icon: './img/icons/bitcoin-btc-logo.png'
  },
  42151: {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum One',
    icon: './img/icons/arbitrum-arb-logo.png'
  },
  43114: {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche C-Chain',
    icon: './img/icons/avalanche-avax-logo.png'
  },
  59141: {
    id: 'linea', // not listed on CoinGecko; placeholder
    symbol: 'ETH',
    name: 'Linea Testnet',
    icon: './img/icons/ethereum-eth-logo.png'
  },
  59144: {
    id: 'linea', // not listed on CoinGecko; placeholder
    symbol: 'ETH',
    name: 'Linea Mainnet',
    icon: './img/icons/ethereum-eth-logo.png'
  },
  80001: {
    id: 'polygon',
    symbol: 'POL',
    name: 'Polygon Mumbai',
    icon: './img/icons/polygon-matic-logo.png'
  },
  80002: {
    id: 'polygon', // CoinGecko uses "polygon" for Amoy too
    symbol: 'POL',
    name: 'Amoy Testnet',
    icon: './img/icons/polygon-matic-logo.png'
  },
  84532: {
    id: 'base',
    symbol: 'ETH',
    name: 'Base Sepolia',
    icon: './img/icons/base-eth-logo.png'
  },
  11155111: {
    id: 'ethereum',
    symbol: 'SepoliaETH',
    name: 'Sepolia Testnet',
    icon: './img/icons/ethereum-eth-logo.png'
  }
};

export const polygonMainnet = {
  chainId: '0x89', // 137 in hex
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com']
};

export const CONTRACT_ADDRESS_STAGING =
  '0x574383E627bA8ac7442d1f5a8369830c9e64A00';
//issuer 1: 0x8619dDE66AbeDf8818690F79feF00Bb433FDEA7f
//issuer 2: 0x574383E627bA8ac7442d1f5a8369830c9e64A00

export const CONTRACT_ADDRESS_PRODUCTION =
  '0x9ac93245367975b06013C1EE0204A5E42e91b57B';
//issuer 1: 0x68eA8A05D52CFe66031383FEA4e3256cFE9ff5Ce
//issuer 2: 0x9ac93245367975b06013C1EE0204A5E42e91b57B

export const USDT_ADDRESS_STAGING =
  '0x5DC14a664d551F24e9f7A4C9c6215a84E44f0f1E';

export const USDT_ADDRESS_PRODUCTION =
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';

export const USDC_ADDRESS_PRODUCTION =
  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

export const XAUT_ADDRESS_PRODUCTION =
  '0x6D205337F45D6850c3c3006e28d5b52c8a432c35';

export const POLYGON_RPC_URL = 'https://polygon.gateway.tenderly.co';

export const RPC_LIST = [
  {
    name: 'Tenderly',
    url: 'https://polygon.gateway.tenderly.co'
  },
  {
    name: 'Polygon RPC',
    url: 'https://polygon-rpc.com'
  }
];

export const DEFAULT_CURRENCY = 'USDT0';

export const CURRENCIES = [
  {
    name: 'USDT0',
    value: USDT_ADDRESS_PRODUCTION
  },
  {
    name: 'USDC',
    value: USDC_ADDRESS_PRODUCTION
  },
  {
    name: 'XAUT0',
    value: XAUT_ADDRESS_PRODUCTION
  }
];
