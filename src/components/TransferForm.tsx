import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Send, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { TransferState } from '../types';
import { isValidAddress, parseAmount, getExplorerUrl } from '../utils/helpers';
import { transferUSDT } from '../utils/web3';

interface TransferFormProps {
  balance: bigint;
  chainId: number | null;
  isDisabled: boolean;
}

export function TransferForm({ balance, chainId, isDisabled }: TransferFormProps) {
  const [state, setState] = useState<TransferState>({
    recipient: '',
    amount: '',
    isSubmitting: false,
    error: null,
    txHash: null,
  });

  const [validationErrors, setValidationErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { recipient?: string; amount?: string } = {};

    if (!state.recipient) {
      errors.recipient = 'Recipient address is required';
    } else if (!isValidAddress(state.recipient)) {
      errors.recipient = 'Invalid Ethereum address format';
    }

    if (!state.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amountBigInt = parseAmount(state.amount);
      if (amountBigInt <= 0) {
        errors.amount = 'Amount must be greater than 0';
      } else if (amountBigInt > balance) {
        errors.amount = 'Insufficient balance';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !chainId) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null, txHash: null }));

    try {
      const amountBigInt = parseAmount(state.amount);
      const txHash = await transferUSDT(state.recipient, amountBigInt, chainId);
      
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        txHash,
        recipient: '',
        amount: '',
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: err instanceof Error ? err.message : 'Transaction failed',
      }));
    }
  };

  const handleInputChange = (field: 'recipient' | 'amount', value: string) => {
    setState(prev => ({ ...prev, [field]: value, error: null }));
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const hasBalance = balance > BigInt(0);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Send className="w-5 h-5 text-emerald-400" />
          Transfer USDT
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasBalance ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-medium">Insufficient Balance</p>
              <p className="text-slate-400 text-sm mt-1">
                You need USDT in your wallet to make a transfer.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-slate-300">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                type="text"
                placeholder="0x..."
                value={state.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                  validationErrors.recipient ? 'border-red-500' : ''
                }`}
                disabled={state.isSubmitting || isDisabled}
              />
              {validationErrors.recipient && (
                <p className="text-red-400 text-sm">{validationErrors.recipient}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-300">
                Amount (USDT)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={state.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 ${
                  validationErrors.amount ? 'border-red-500' : ''
                }`}
                disabled={state.isSubmitting || isDisabled}
              />
              {validationErrors.amount && (
                <p className="text-red-400 text-sm">{validationErrors.amount}</p>
              )}
            </div>

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{state.error}</p>
              </div>
            )}

            {state.txHash && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-400 font-medium">Transaction Submitted!</p>
                </div>
                <a
                  href={getExplorerUrl(chainId!, state.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  View on Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={state.isSubmitting || isDisabled}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send USDT
                </span>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}