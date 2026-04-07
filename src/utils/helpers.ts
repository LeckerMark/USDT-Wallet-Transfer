import { USDT_DECIMALS } from './constants';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: bigint): string {
  const value = balance.toString();
  const integerPart = value.slice(0, -USDT_DECIMALS) || '0';
  const decimalPart = value.slice(-USDT_DECIMALS).padStart(USDT_DECIMALS, '0');
  const formatted = `${integerPart}.${decimalPart}`;
  return parseFloat(formatted).toFixed(2);
}

export function parseAmount(amount: string): bigint {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return BigInt(0);
  const multiplied = num * Math.pow(10, USDT_DECIMALS);
  return BigInt(Math.floor(multiplied));
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function getNetworkName(chainId: number | null): string {
  if (!chainId) return 'Unknown Network';
  const names: Record<number, string> = {
    1: 'Ethereum',
    56: 'BNB Smart Chain',
    137: 'Polygon',
    42161: 'Arbitrum One',
  };
  return names[chainId] || 'Unknown Network';
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    56: 'https://bscscan.com',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
  };
  const baseUrl = explorers[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}