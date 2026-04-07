import { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance, useDisconnect as useWagmiDisconnect, useSwitchChain } from 'wagmi';
import { parseUnits } from 'viem';
import { USDT_ADDRESSES, ERC20_ABI } from './constants';
import { publicClient } from './web3';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useWagmiDisconnect();
  const { switchChain } = useSwitchChain();

  return {
    address,
    isConnected,
    chainId: chain?.id ?? null,
    disconnect,
    switchChain,
  };
}

export function useUSDTBalance(address: string | undefined, chainId: number | null) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !chainId) {
      setBalance('0');
      return;
    }

    const usdtAddress = USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES];
    if (!usdtAddress) {
      setBalance('0');
      return;
    }

    setIsLoading(true);
    try {
      const client = publicClient({ chainId });
      const result = await client.readContract({
        address: usdtAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      });
      
      setBalance(result.toString());
    } catch (error) {
      console.error('Failed to fetch USDT balance:', error);
      setBalance('0');
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, refetch: fetchBalance };
}