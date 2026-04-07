export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
}

export interface USDTBalance {
  value: bigint;
  formatted: string;
  isLoading: boolean;
  error: string | null;
}

export interface TransferState {
  recipient: string;
  amount: string;
  isSubmitting: boolean;
  error: string | null;
  txHash: string | null;
}

export interface NetworkInfo {
  id: number;
  name: string;
  symbol: string;
  usdtAddress: string;
  rpcUrl: string;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}