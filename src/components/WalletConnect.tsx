import { Button } from '../components/ui/button';
import { Wallet, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatAddress, getNetworkName } from '../utils/helpers';
import { NETWORKS } from '../utils/constants';
import { switchNetwork } from '../utils/web3';

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnect({
  isConnected,
  address,
  chainId,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchNetwork = async (newChainId: number) => {
    await switchNetwork(newChainId);
    setShowDropdown(false);
  };

  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-105"
      >
        <Wallet className="w-5 h-5 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 hover:border-emerald-500/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
          {address?.slice(2, 4).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-white font-medium text-sm">{formatAddress(address || '')}</p>
          <p className="text-slate-400 text-xs">{getNetworkName(chainId)}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Switch Network</p>
            <div className="space-y-1">
              {NETWORKS.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleSwitchNetwork(network.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    chainId === network.id
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {network.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              onDisconnect();
              setShowDropdown(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}