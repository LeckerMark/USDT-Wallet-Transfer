import { Card, CardContent } from '../components/ui/card';
import { RefreshCw, DollarSign } from 'lucide-react';
import { formatBalance } from '../utils/helpers';
import { USDTBalance as USDTBalanceType } from '../types';

interface USDTBalanceProps {
  balance: USDTBalanceType;
  onRefresh: () => void;
}

export function USDTBalance({ balance, onRefresh }: USDTBalanceProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">USDT Balance</p>
              <p className="text-xs text-slate-500">Tether USD</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={balance.isLoading}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${balance.isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          {balance.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400">Loading balance...</span>
            </div>
          ) : balance.error ? (
            <div>
              <p className="text-red-400 text-sm">{balance.error}</p>
              <button
                onClick={onRefresh}
                className="text-emerald-400 text-sm mt-1 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold text-white">
                {balance.formatted}
              </p>
              <p className="text-slate-400 text-sm mt-1">USDT</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}