import { NETWORKS, ERC20_ABI } from './constants';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export async function connectWallet(): Promise<{ address: string; chainId: number }> {
  if (!window.ethereum) {
    throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found. Please unlock your wallet.');
  }

  const chainIdHex = await window.ethereum.request({
    method: 'eth_chainId',
  }) as string;

  const chainId = parseInt(chainIdHex, 16);

  return {
    address: accounts[0],
    chainId,
  };
}

export async function getUSDTBalance(address: string, chainId: number): Promise<bigint> {
  const network = NETWORKS.find(n => n.id === chainId);
  if (!network) {
    throw new Error('Network not supported');
  }

  const response = await fetch(network.rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: network.usdtAddress,
          data: '0x70a08231' + address.slice(2).padStart(64, '0'),
        },
        'latest',
      ],
    }),
  });

  const { result, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to fetch balance');
  }

  return BigInt(result);
}

export async function transferUSDT(
  recipient: string,
  amount: bigint,
  chainId: number
): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  const network = NETWORKS.find(n => n.id === chainId);
  if (!network) {
    throw new Error('Network not supported');
  }

  const amountHex = amount.toString(16).padStart(64, '0');
  const recipientPadded = recipient.slice(2).padStart(64, '0');
  const data = '0xa9059cbb' + recipientPadded + amountHex;

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: (await window.ethereum.request({ method: 'eth_accounts' }) as string[])[0],
        to: network.usdtAddress,
        data,
      },
    ],
  }) as string;

  return txHash;
}

export async function switchNetwork(chainId: number): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + chainId.toString(16) }],
    });
    return true;
  } catch {
    return false;
  }
}

export function onAccountChanged(callback: (address: string | null) => void): () => void {
  if (!window.ethereum?.on) return () => {};

  const handler = (accounts: unknown) => {
    const accs = accounts as string[];
    callback(accs && accs.length > 0 ? accs[0] : null);
  };

  window.ethereum.on('accountsChanged', handler);
  return () => {
    window.ethereum.removeListener?.('accountsChanged', handler);
  };
}

export function onChainChanged(callback: (chainId: number) => void): () => void {
  if (!window.ethereum?.on) return () => {};

  const handler = (chainIdHex: unknown) => {
    callback(parseInt(chainIdHex as string, 16));
  };

  window.ethereum.on('chainChanged', handler);
  return () => {
    window.ethereum.removeListener?.('chainChanged', handler);
  };
}