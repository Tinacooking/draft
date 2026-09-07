import React from 'react';
import { Token } from '../types';
import { Send, Download, ArrowLeftRight, FileText, TrendingUp, Sparkles } from 'lucide-react';

interface BalanceOverviewProps {
  tokens: Token[];
  onOpenSend: () => void;
  onOpenReceive: () => void;
  onOpenBridge: () => void;
  onOpenInvoiceModal: () => void;
  selectedTokenId: string;
  onSelectToken: (token: Token) => void;
}

export const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  tokens,
  onOpenSend,
  onOpenReceive,
  onOpenBridge,
  onOpenInvoiceModal,
  selectedTokenId,
  onSelectToken,
}) => {
  // Calculate total portfolio USD value
  const totalBalanceUsd = tokens.reduce(
    (acc, token) => acc + token.balance * token.usdPrice,
    0
  );

  return (
    <div id="balance-overview-card" className="nb-card p-5 sm:p-6 bg-white relative overflow-hidden">
      {/* Decorative Neo-Brutalist Red Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#E11D48] border-b-2 border-neutral-950"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
        {/* Balance Display */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold tracking-wider text-neutral-600 uppercase">
              Total Non-Custodial Balance
            </span>
            <span className="inline-flex items-center gap-1 bg-[#E11D48]/10 text-[#E11D48] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border border-[#E11D48]/30">
              <Sparkles className="w-3 h-3" /> MULTI-CHAIN SECURED
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight font-mono">
              ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A] text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>+12.4% ($5,320.10)</span>
            </div>
          </div>

          <p className="text-xs font-mono text-neutral-500 mt-1">
            Aggregated liquidity on Base, Arbitrum, Ethereum & Solana
          </p>
        </div>

        {/* Action Buttons with Neo-Brutalism hard drop shadows */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            id="btn-quick-send"
            onClick={onOpenSend}
            className="nb-btn-primary py-2.5 px-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>SEND</span>
          </button>

          <button
            id="btn-quick-receive"
            onClick={onOpenReceive}
            className="nb-btn-secondary py-2.5 px-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs"
          >
            <Download className="w-4 h-4 text-[#E11D48]" />
            <span>RECEIVE</span>
          </button>

          <button
            id="btn-quick-bridge"
            onClick={onOpenBridge}
            className="nb-btn-secondary py-2.5 px-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-neutral-900" />
            <span>SWAP</span>
          </button>

          <button
            id="btn-quick-invoice"
            onClick={onOpenInvoiceModal}
            className="nb-btn-black py-2.5 px-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs"
          >
            <FileText className="w-4 h-4 text-[#E11D48]" />
            <span>INVOICE</span>
          </button>
        </div>
      </div>

      {/* Token Assets Pills Grid */}
      <div className="mt-6 pt-5 border-t-2 border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black tracking-wide text-neutral-900 uppercase">
            Active Crypto Liquidity Pools
          </span>
          <span className="text-[11px] font-mono text-neutral-500">
            Click to auto-load in payment module
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tokens.map((token) => {
            const isSelected = token.id === selectedTokenId;
            const tokenUsd = token.balance * token.usdPrice;

            return (
              <div
                key={token.id}
                id={`token-pill-${token.id}`}
                onClick={() => onSelectToken(token)}
                className={`p-3 rounded-xl border-2 border-neutral-950 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#E11D48]/10 border-[#E11D48] shadow-[3px_3px_0px_#E11D48] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white hover:bg-neutral-50 shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_#0A0A0A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-md border border-neutral-950 flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: token.iconBg }}
                    >
                      {token.symbol.slice(0, 1)}
                    </span>
                    <span className="font-black text-xs text-neutral-950">{token.symbol}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      token.change24h >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </span>
                </div>

                <div className="font-mono">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    {token.balance.toLocaleString('en-US', { maximumFractionDigits: 3 })}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    ${tokenUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
