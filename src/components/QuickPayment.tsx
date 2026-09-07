import React, { useState } from 'react';
import { Token, Network, Transaction } from '../types';
import { ArrowRight, Zap, CheckCircle2, AlertCircle, Copy, Check, QrCode, Sparkles, RefreshCw } from 'lucide-react';

interface QuickPaymentProps {
  tokens: Token[];
  currentNetwork: Network;
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  onPaymentSuccess: (tx: Transaction) => void;
}

export const QuickPayment: React.FC<QuickPaymentProps> = ({
  tokens,
  currentNetwork,
  selectedToken,
  onSelectToken,
  onPaymentSuccess,
}) => {
  const [recipient, setRecipient] = useState('vitalik.eth');
  const [amount, setAmount] = useState('250.00');
  const [gasSpeed, setGasSpeed] = useState<'eco' | 'normal' | 'instant'>('instant');
  const [memo, setMemo] = useState('SaaS Monthly API subscription');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTx, setLastTx] = useState<Transaction | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const usdValue = numAmount * selectedToken.usdPrice;

  // Preset quick addresses
  const quickRecipients = [
    { label: 'vitalik.eth', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
    { label: 'merchant.sol', address: '7pWk84DqZ65U9s8gZkC2fBvL81NmX9k' },
    { label: 'acme-corp.eth', address: '0x94827011d8BF2a220268153C35C8e4b7F2e1B182' },
  ];

  const handleMax = () => {
    setAmount((selectedToken.balance * 0.95).toFixed(2));
  };

  const handleExecutePayment = () => {
    if (!recipient.trim()) {
      setErrorMsg('Please provide a valid recipient Web3 address or ENS domain');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Amount must be greater than 0');
      return;
    }
    if (numAmount > selectedToken.balance) {
      setErrorMsg(`Insufficient ${selectedToken.symbol} balance (${selectedToken.balance})`);
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    // Realistic Web3 multi-step transaction broadcast simulation
    setProcessStep('1. Verifying EIP-712 Signature & Nonce...');

    setTimeout(() => {
      setProcessStep(`2. Broadcasting to ${currentNetwork.name} Mempool...`);
    }, 1000);

    setTimeout(() => {
      setProcessStep('3. Awaiting Block Validator Consensus...');
    }, 2000);

    setTimeout(() => {
      const generatedHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        hash: generatedHash,
        type: 'send',
        title: `Instant Web3 Payment to ${recipient}`,
        asset: selectedToken.symbol,
        amount: numAmount,
        usdAmount: usdValue,
        counterparty: recipient,
        timestamp: 'Just now',
        status: 'confirmed',
        network: currentNetwork.name,
        gasFee: gasSpeed === 'instant' ? '$0.008' : gasSpeed === 'normal' ? '$0.004' : '$0.001',
        memo: memo || 'Instant Web3 Payment',
      };

      setIsProcessing(false);
      setProcessStep('');
      setLastTx(newTx);
      setShowSuccessModal(true);
      onPaymentSuccess(newTx);
    }, 3000);
  };

  return (
    <div id="quick-payment-container" className="nb-card p-5 sm:p-6 bg-white relative">
      {/* Card Header with red accent */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-950 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center font-bold text-sm border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-950 tracking-tight uppercase">
              Send Web3 Payment
            </h2>
            <p className="text-[11px] font-mono text-neutral-500">
              Low-fee instant transfer with cross-chain routing
            </p>
          </div>
        </div>

        <span className="nb-badge bg-emerald-100 text-emerald-900 border-2 border-neutral-950 px-2.5 py-1 text-[11px] font-mono">
          EIP-4337 READY
        </span>
      </div>

      {/* Recipient Input */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
            <label htmlFor="recipient-input">RECIPIENT (ENS / ADDRESS)</label>
            <span className="text-[11px] font-mono text-neutral-500">Supports .eth, .sol, 0x</span>
          </div>

          <div className="relative">
            <input
              id="recipient-input"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. vitalik.eth or 0x..."
              className="nb-input w-full px-3.5 py-2.5 text-sm font-mono font-bold text-neutral-900 pr-20"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRecipient('0x71C2...02Fc')}
                className="text-[10px] font-mono font-bold bg-neutral-100 hover:bg-neutral-200 border border-neutral-950 px-2 py-1 rounded"
              >
                PASTE
              </button>
            </div>
          </div>

          {/* Quick Recipient pills */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Recent:</span>
            {quickRecipients.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setRecipient(q.label)}
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-[#E11D48]/10 hover:text-[#E11D48] hover:border-[#E11D48] border border-neutral-950 transition-all whitespace-nowrap"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asset & Amount Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Asset Dropdown */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              PAY WITH ASSET
            </label>
            <div className="relative">
              <select
                id="asset-select"
                value={selectedToken.id}
                onChange={(e) => {
                  const found = tokens.find((t) => t.id === e.target.value);
                  if (found) onSelectToken(found);
                }}
                className="nb-input w-full px-3.5 py-2.5 text-sm font-bold text-neutral-900 appearance-none bg-white cursor-pointer"
              >
                {tokens.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.symbol} - ${t.usdPrice} (Bal: {t.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-neutral-700 font-bold text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="sm:col-span-7">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <label htmlFor="amount-input">AMOUNT</label>
              <button
                type="button"
                onClick={handleMax}
                className="text-[11px] font-mono font-bold text-[#E11D48] hover:underline cursor-pointer"
              >
                MAX: {selectedToken.balance.toFixed(2)} {selectedToken.symbol}
              </button>
            </div>
            <div className="relative">
              <input
                id="amount-input"
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="nb-input w-full px-3.5 py-2.5 text-sm font-mono font-black text-neutral-900 pr-16"
              />
              <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-neutral-500">
                {selectedToken.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Live Calculation Callout */}
        <div className="bg-neutral-50 border-2 border-neutral-950 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="text-neutral-600">
            Equivalent Value: <strong className="text-neutral-950 text-sm font-black">${usdValue.toFixed(2)} USD</strong>
          </div>
          <div className="text-neutral-600 text-right">
            Route: <strong className="text-emerald-700 font-bold">1:1 Direct Route</strong>
          </div>
        </div>

        {/* Gas Speed Selector with Neo-Brutalist cards */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 mb-1.5">
            TRANSACTION SPEED / GAS
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'eco', name: 'ECO', time: '~8 sec', gwei: '8 Gwei', cost: '$0.001' },
              { id: 'normal', name: 'STANDARD', time: '~3 sec', gwei: '14 Gwei', cost: '$0.004' },
              { id: 'instant', name: 'TURBO', time: '< 1 sec', gwei: '22 Gwei', cost: '$0.008' },
            ].map((speed) => {
              const active = gasSpeed === speed.id;
              return (
                <button
                  key={speed.id}
                  type="button"
                  onClick={() => setGasSpeed(speed.id as any)}
                  className={`p-2.5 rounded-xl border-2 border-neutral-950 text-left transition-all ${
                    active
                      ? 'bg-[#E11D48] text-white shadow-[3px_3px_0px_#0A0A0A] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-neutral-900 hover:bg-neutral-50 shadow-[2px_2px_0px_#0A0A0A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-black text-xs">{speed.name}</span>
                    {active && <Zap className="w-3 h-3 text-white fill-white" />}
                  </div>
                  <div className={`text-[10px] font-mono ${active ? 'text-white/80' : 'text-neutral-500'}`}>
                    {speed.time} • {speed.cost}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memo Input */}
        <div>
          <label htmlFor="memo-input" className="block text-xs font-bold text-neutral-800 mb-1.5">
            ON-CHAIN MEMO / INVOICE REF (OPTIONAL)
          </label>
          <input
            id="memo-input"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="e.g. Milestone 1 payment"
            className="nb-input w-full px-3.5 py-2 text-xs font-mono font-medium text-neutral-900"
          />
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="bg-rose-50 border-2 border-rose-600 text-rose-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Big Neo-Brutalist Execute Button */}
        <button
          id="btn-execute-web3-payment"
          type="button"
          disabled={isProcessing}
          onClick={handleExecutePayment}
          className={`w-full nb-btn-primary py-3.5 px-6 text-sm flex items-center justify-center gap-2 uppercase tracking-wider ${
            isProcessing ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{processStep || 'BROADCASTING TRANSACTION...'}</span>
            </>
          ) : (
            <>
              <span>AUTHORIZE & SEND PAYMENT</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>

        {/* Security & Nonce Guarantee */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" /> Smart Escrow Ready
          </span>
          <span>Zero MEV Front-running Guard</span>
        </div>
      </div>

      {/* Success Transaction Popup Modal */}
      {showSuccessModal && lastTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="nb-card bg-white max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-center text-neutral-950 uppercase tracking-tight">
              Payment Broadcast Confirmed!
            </h3>
            <p className="text-xs font-mono text-center text-neutral-600 mt-1 mb-4">
              Block validator successfully confirmed on-chain settlement.
            </p>

            <div className="bg-neutral-50 border-2 border-neutral-950 rounded-xl p-4 space-y-2.5 font-mono text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount Sent:</span>
                <strong className="text-neutral-950 font-bold">
                  {lastTx.amount} {lastTx.asset} (${lastTx.usdAmount.toFixed(2)})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Recipient:</span>
                <strong className="text-neutral-950 font-bold">{lastTx.counterparty}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tx Hash:</span>
                <span className="text-[#E11D48] font-bold underline cursor-pointer">
                  {lastTx.hash}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Network:</span>
                <span className="text-neutral-950 font-bold">{lastTx.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Gas Paid:</span>
                <span className="text-neutral-950">{lastTx.gasFee}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="nb-btn-primary w-full py-2.5 text-xs font-black"
            >
              CLOSE & VIEW IN LEDGER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
