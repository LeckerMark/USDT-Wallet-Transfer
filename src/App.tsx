import { useState, useEffect, useCallback } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { USDTBalance } from './components/USDTBalance';
import { TransferForm } from './components/TransferForm';
import { WalletState, USDTBalance as USDTBalanceType } from './types';
import { formatBalance } from './utils/helpers';
import { connectWallet, getUSDTBalance, onAccountChanged, onChainChanged } from './utils/web3';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
  });

  const [balance, setBalance] = useState<USDTBalanceType>({
    value: BigInt(0),
    formatted: '0.00',
    isLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!wallet.address || !wallet.chainId) return;

    setBalance(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const value = await getUSDTBalance(wallet.address, wallet.chainId);
      setBalance({
        value,
        formatted: formatBalance(value),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch balance',
      }));
    }
  }, [wallet.address, wallet.chainId]);

  useEffect(() => {
    if (wallet.isConnected) {
      fetchBalance();
    }
  }, [wallet.isConnected, fetchBalance]);

  useEffect(() => {
    const unsubscribeAccount = onAccountChanged((address) => {
      if (address) {
        setWallet(prev => ({ ...prev, address }));
      } else {
        setWallet({ isConnected: false, address: null, chainId: null });
        setBalance({ value: BigInt(0), formatted: '0.00', isLoading: false, error: null });
      }
    });

    const unsubscribeChain = onChainChanged((chainId) => {
      setWallet(prev => ({ ...prev, chainId }));
    });

    return () => {
      unsubscribeAccount();
      unsubscribeChain();
    };
  }, []);

  const handleConnect = async () => {
    try {
      const { address, chainId } = await connectWallet();
      setWallet({ isConnected: true, address, chainId });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      alert(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    setWallet({ isConnected: false, address: null, chainId: null });
    setBalance({ value: BigInt(0), formatted: '0.00', isLoading: false, error: null });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">USDT Transfer</h1>
              <p className="text-slate-400 text-xs">Cross-chain USDT transfers</p>
            </div>
          </div>
          <WalletConnect
            isConnected={wallet.isConnected}
            address={wallet.address}
            chainId={wallet.chainId}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {!wallet.isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6">
              <span className="text-white font-bold text-4xl">$</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Welcome to USDT Transfer</h2>
            <p className="text-slate-400 max-w-md mb-8">
              Connect your wallet to check your USDT balance and make transfers across EVM networks.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum'].map((network) => (
                <span
                  key={network}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm"
                >
                  {network}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <USDTBalance balance={balance} onRefresh={fetchBalance} />
            <TransferForm
              balance={balance.value}
              chainId={wallet.chainId}
              isDisabled={balance.isLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-slate-500 text-sm text-center">
            USDT Transfer DApp — Transfer USDT securely across EVM networks
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;