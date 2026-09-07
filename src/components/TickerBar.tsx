import React from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Flame, Radio } from 'lucide-react';
import { Token } from '../types';

interface TickerBarProps {
  tokens: Token[];
}

export const TickerBar: React.FC<TickerBarProps> = ({ tokens }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md border-b border-neutral-200/60 py-2 px-4 overflow-x-auto scrollbar-none transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs font-mono whitespace-nowrap">
        {/* Left Live Indicator */}
        <div className="flex items-center gap-2 font-bold shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-rose-600 font-bold tracking-wider flex items-center gap-1 text-[11px]">
            <Radio className="w-3 h-3 animate-pulse" /> LIVE MEMPOOL
          </span>
          <span className="text-neutral-300">|</span>
        </div>

        {/* Tokens Stream with interactive hover */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          {tokens.map((token) => {
            const isPositive = token.change24h >= 0;
            return (
              <div 
                key={token.id} 
                className="flex items-center gap-2 shrink-0 px-2.5 py-1 rounded-lg hover:bg-white/90 hover:shadow-2xs border border-transparent hover:border-neutral-200/80 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <span className="font-bold text-neutral-800">{token.symbol}</span>
                <span className="text-neutral-900 font-semibold font-mono">
                  ${token.usdPrice < 1 ? token.usdPrice.toFixed(2) : token.usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`flex items-center text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full ${
                    isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {isPositive ? '+' : ''}{token.change24h}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Global Protocol metrics */}
        <div className="hidden xl:flex items-center gap-4 text-neutral-500 shrink-0 text-[11px]">
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SETTLEMENT: <strong className="text-neutral-900">0.2s</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>24H VOL: <strong className="text-neutral-900">$84.2M</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

