import { NetworkInfo } from '../types';

export const NETWORKS: NetworkInfo[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    rpcUrl: 'https://eth.llamarpc.com',
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    usdtAddress: '0x55d398324f791d267c29F54b336e8b6E1eBf3920',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    usdtAddress: '0xc2132D05D31c914a87C66167C67a1c29c7F37aF9',
    rpcUrl: 'https://polygon-rpc.com',
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    usdtAddress: '0xFd086bC7CD5C481DCC9C85adE4AF092cB2Af5fDC',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
  },
];

export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export const USDT_DECIMALS = 6;