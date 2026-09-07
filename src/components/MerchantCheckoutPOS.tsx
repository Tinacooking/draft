import React, { useState, useEffect } from 'react';
import { CheckoutInvoice, Transaction } from '../types';
import { SAMPLE_INVOICE } from '../data/mockData';
import { QrCode, Copy, Check, Clock, ShieldCheck, CheckCircle2, RotateCcw, ArrowRight, ExternalLink, Zap } from 'lucide-react';

interface MerchantCheckoutPOSProps {
  onPaymentSettled: (tx: Transaction) => void;
}

export const MerchantCheckoutPOS: React.FC<MerchantCheckoutPOSProps> = ({ onPaymentSettled }) => {
  const [invoice, setInvoice] = useState<CheckoutInvoice>(SAMPLE_INVOICE);
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'USDT' | 'ETH' | 'SOL'>('USDC');
  const [timeLeft, setTimeLeft] = useState<number>(invoice.expiresInSeconds);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  // Countdown timer effect
  useEffect(() => {
    if (invoice.status === 'paid') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [invoice.status]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(invoice.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setSimulationStep('Detecting incoming unconfirmed tx in mempool...');

    setTimeout(() => {
      setSimulationStep('Validating smart contract allowance & balance...');
    }, 1200);

    setTimeout(() => {
      setSimulationStep('Block #20,491,921 minted: 12/12 Confirmations...');
    }, 2400);

    setTimeout(() => {
      const generatedHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      const settledTx: Transaction = {
        id: `pos-${Date.now()}`,
        hash: generatedHash,
        type: 'checkout',
        title: `${invoice.merchantName} - ${invoice.description.slice(0, 32)}...`,
        asset: selectedToken,
        amount: selectedToken === 'ETH' ? 0.065 : selectedToken === 'SOL' ? 1.21 : invoice.totalUsd,
        usdAmount: invoice.totalUsd,
        counterparty: invoice.depositAddress,
        timestamp: 'Just now',
        status: 'confirmed',
        network: selectedToken === 'SOL' ? 'Solana' : 'Base L2',
        gasFee: '$0.003',
        memo: `Invoice #${invoice.id}`,
      };

      setInvoice((prev) => ({
        ...prev,
        status: 'paid',
        txHash: generatedHash,
      }));
      setIsSimulating(false);
      setSimulationStep('');
      onPaymentSettled(settledTx);
    }, 3600);
  };

  const handleResetInvoice = () => {
    setInvoice({
      ...SAMPLE_INVOICE,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'unpaid',
      txHash: undefined,
    });
    setTimeLeft(900);
    setSimulationStep('');
    setIsSimulating(false);
  };

  return (
    <div id="merchant-checkout-pos" className="nb-card p-5 sm:p-6 bg-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-neutral-950 mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center font-bold text-sm border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-950 tracking-tight uppercase">
              Web3 Checkout POS Gateway
            </h2>
            <p className="text-[11px] font-mono text-neutral-500">
              Merchant instant crypto point-of-sale & checkout widget
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {invoice.status === 'paid' ? (
            <span className="nb-badge bg-emerald-400 text-neutral-950 px-3 py-1 text-xs font-black flex items-center gap-1.5 border-2 border-neutral-950">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" /> PAID & SETTLED
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="nb-badge bg-amber-200 text-neutral-950 px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1 border-2 border-neutral-950">
                <Clock className="w-3 h-3 text-neutral-950" /> {formatTime(timeLeft)}
              </span>
              <span className="nb-badge bg-neutral-100 text-neutral-800 px-2.5 py-1 text-xs font-mono font-bold border-2 border-neutral-950">
                UNPAID
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: QR & Address left, Itemized Bill right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Col: QR Code Box with high contrast & red corner brackets */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-neutral-50 rounded-2xl border-2 border-neutral-950 shadow-[4px_4px_0px_#0A0A0A]">
          {/* QR Code Container with Neo-Brutalist Frame */}
          <div className="relative p-4 bg-white rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] mb-3">
            {/* Corner styling */}
            <div className="w-44 h-44 flex items-center justify-center relative">
              {/* Dynamic stylized Web3 QR SVG */}
              <svg viewBox="0 0 160 160" className="w-full h-full">
                {/* Outer positioning squares */}
                <rect x="10" y="10" width="40" height="40" fill="#0A0A0A" rx="4" />
                <rect x="18" y="18" width="24" height="24" fill="#FFFFFF" rx="2" />
                <rect x="24" y="24" width="12" height="12" fill="#E11D48" rx="2" />

                <rect x="110" y="10" width="40" height="40" fill="#0A0A0A" rx="4" />
                <rect x="118" y="18" width="24" height="24" fill="#FFFFFF" rx="2" />
                <rect x="124" y="24" width="12" height="12" fill="#E11D48" rx="2" />

                <rect x="10" y="110" width="40" height="40" fill="#0A0A0A" rx="4" />
                <rect x="18" y="118" width="24" height="24" fill="#FFFFFF" rx="2" />
                <rect x="24" y="124" width="12" height="12" fill="#E11D48" rx="2" />

                {/* Matrix payload dots */}
                <rect x="60" y="15" width="8" height="8" fill="#0A0A0A" />
                <rect x="75" y="15" width="8" height="8" fill="#0A0A0A" />
                <rect x="90" y="25" width="8" height="8" fill="#E11D48" />
                <rect x="60" y="35" width="16" height="8" fill="#0A0A0A" />
                <rect x="85" y="40" width="8" height="16" fill="#0A0A0A" />

                {/* Center logo badge */}
                <rect x="60" y="60" width="40" height="40" fill="#0A0A0A" rx="8" />
                <rect x="64" y="64" width="32" height="32" fill="#E11D48" rx="6" />
                <text x="80" y="86" fill="white" fontSize="20" fontWeight="900" textAnchor="middle">
                  R⚡
                </text>

                <rect x="20" y="65" width="8" height="16" fill="#0A0A0A" />
                <rect x="35" y="75" width="16" height="8" fill="#0A0A0A" />
                <rect x="115" y="65" width="8" height="20" fill="#0A0A0A" />
                <rect x="135" y="80" width="12" height="8" fill="#E11D48" />

                <rect x="65" y="110" width="12" height="12" fill="#0A0A0A" />
                <rect x="85" y="115" width="18" height="8" fill="#0A0A0A" />
                <rect x="110" y="110" width="16" height="8" fill="#0A0A0A" />
                <rect x="130" y="125" width="16" height="16" fill="#0A0A0A" />
                <rect x="65" y="135" width="30" height="8" fill="#0A0A0A" />
              </svg>

              {/* Status Overlay if paid */}
              {invoice.status === 'paid' && (
                <div className="absolute inset-0 bg-emerald-500/90 rounded-lg flex flex-col items-center justify-center text-white border-2 border-neutral-950 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 stroke-[3] text-neutral-950 mb-1" />
                  <span className="font-black text-neutral-950 text-sm tracking-wide">
                    PAID 100%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Token Selection pills */}
          <div className="flex items-center gap-1.5 mb-3 w-full justify-center">
            {(['USDC', 'USDT', 'ETH', 'SOL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedToken(t)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border-2 border-neutral-950 transition-all ${
                  selectedToken === t
                    ? 'bg-[#E11D48] text-white shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-white text-neutral-800 hover:bg-neutral-100 shadow-[1px_1px_0px_#0A0A0A]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Deposit Address Box */}
          <div className="w-full bg-white p-2.5 rounded-xl border-2 border-neutral-950 text-center font-mono">
            <div className="text-[10px] text-neutral-500 font-bold uppercase mb-0.5">
              Deposit {selectedToken} Address
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-neutral-950 truncate max-w-[200px]">
                {invoice.depositAddress}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-neutral-100 rounded transition-all text-neutral-700"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Bill Details & Interactive simulation */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            {/* Merchant info */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  Merchant Storefront
                </span>
                <h3 className="text-base font-black text-neutral-950">
                  {invoice.merchantName}
                </h3>
              </div>
              <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded border border-neutral-300">
                {invoice.id}
              </span>
            </div>

            {/* Itemized bill */}
            <div className="space-y-2 mb-4">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 px-3 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200"
                >
                  <span className="font-medium text-neutral-800">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold text-neutral-950">
                    ${(item.priceUsd * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            <div className="bg-[#E11D48]/10 border-2 border-neutral-950 rounded-xl p-4 flex items-center justify-between shadow-[3px_3px_0px_#0A0A0A] mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-neutral-600 uppercase">
                  TOTAL DUE
                </span>
                <div className="text-2xl font-black font-mono text-neutral-950">
                  ${invoice.totalUsd.toFixed(2)} USD
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#E11D48] uppercase">
                  Crypto Rate
                </span>
                <div className="text-lg font-black font-mono text-[#E11D48]">
                  {selectedToken === 'ETH'
                    ? '0.065 ETH'
                    : selectedToken === 'SOL'
                    ? '1.21 SOL'
                    : `${invoice.totalUsd.toFixed(2)} ${selectedToken}`}
                </div>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="space-y-2 pt-2">
            {invoice.status === 'unpaid' ? (
              <button
                id="btn-simulate-web3-checkout"
                type="button"
                disabled={isSimulating}
                onClick={handleSimulatePayment}
                className={`w-full nb-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2 uppercase ${
                  isSimulating ? 'opacity-75 cursor-wait' : ''
                }`}
              >
                {isSimulating ? (
                  <>
                    <Zap className="w-4 h-4 animate-bounce text-amber-300" />
                    <span>{simulationStep}</span>
                  </>
                ) : (
                  <>
                    <span>SIMULATE CUSTOMER 1-CLICK PAY</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-xs font-mono text-emerald-900 flex items-center justify-between">
                  <span className="font-bold">Settled Hash: {invoice.txHash}</span>
                  <span className="font-bold text-emerald-700 underline cursor-pointer">
                    View on Basescan
                  </span>
                </div>
                <button
                  onClick={handleResetInvoice}
                  className="w-full nb-btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>GENERATE NEW CHECKOUT INVOICE</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Atomic Settlement Guarantee
              </span>
              <span>Gasless for Merchant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
