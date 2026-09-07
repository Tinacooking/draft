import React, { useState } from 'react';
import { CreditCard, Shield, Lock, Unlock, Eye, EyeOff, Sparkles, Smartphone, Check, ArrowUpRight } from 'lucide-react';

export const Web3DebitCard: React.FC = () => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(2500);
  const [copied, setCopied] = useState(false);

  const cardNumber = showNumbers ? '4829 9102 7741 8824' : '•••• •••• •••• 8824';
  const cvv = showNumbers ? '942' : '•••';

  const copyCard = () => {
    navigator.clipboard.writeText('4829910277418824');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="virtual-card-container" className="nb-card p-5 sm:p-6 bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-950 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center font-bold text-sm border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-950 tracking-tight uppercase">
              Web3 Virtual Debit Card
            </h2>
            <p className="text-[11px] font-mono text-neutral-500">
              Spend on-chain crypto anywhere Visa/Mastercard is accepted
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
          2.5% CASHBACK
        </span>
      </div>

      {/* Grid: The physical visual card on left, controls on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: The Sleek Physical Card */}
        <div className="md:col-span-6 flex justify-center">
          <div
            className={`w-full max-w-[340px] aspect-[1.586] rounded-2xl p-5 border border-white/20 relative overflow-hidden transition-all duration-300 ${
              isFrozen
                ? 'bg-neutral-800 text-neutral-400 shadow-md'
                : 'bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-600 text-white shadow-lg shadow-rose-950/15'
            }`}
          >
            {/* Background geometric accents */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full border-4 border-white/20 pointer-events-none"></div>
            <div className="absolute right-12 -bottom-12 w-36 h-36 rounded-full border-4 border-white/15 pointer-events-none"></div>

            {/* Top row: Chip and Apy Brand */}
            <div className="flex items-center justify-between mb-4">
              {/* EMV Chip */}
              <div className="w-11 h-8 bg-amber-200/90 rounded-md border border-amber-300 flex items-center justify-center p-1 shadow-xs">
                <div className="w-full h-full border border-neutral-800/40 rounded grid grid-cols-2 gap-0.5">
                  <div className="border-r border-b border-neutral-800/40"></div>
                  <div className="border-b border-neutral-800/40"></div>
                  <div className="border-r border-neutral-800/40"></div>
                  <div></div>
                </div>
              </div>

              {/* Card Label */}
              <div className="text-right">
                <span className="font-black text-xl tracking-tight text-white">
                  apy
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-white/80 uppercase">
                  CARD TIER
                </span>
              </div>
            </div>

            {/* Middle: Card Number with click to copy */}
            <div
              onClick={copyCard}
              title="Click to copy card number"
              className="my-3 font-mono text-lg sm:text-xl font-black tracking-widest cursor-pointer flex items-center justify-between bg-black/15 px-3 py-1.5 rounded-lg border border-black/30"
            >
              <span>{cardNumber}</span>
              {copied && <Check className="w-4 h-4 text-emerald-300 shrink-0" />}
            </div>

            {/* Bottom Row: Holder Name, Expiry, CVV */}
            <div className="flex items-end justify-between font-mono text-xs pt-1">
              <div>
                <span className="block text-[8px] text-white/70 uppercase">CARDHOLDER</span>
                <span className="font-bold tracking-wider">SATOSHI N.</span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-[8px] text-white/70 uppercase">EXPIRES</span>
                  <span className="font-bold">09/29</span>
                </div>
                <div>
                  <span className="block text-[8px] text-white/70 uppercase">CVV</span>
                  <span className="font-bold">{cvv}</span>
                </div>
              </div>
            </div>

            {/* Frozen Overlay if frozen */}
            {isFrozen && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <Lock className="w-8 h-8 text-rose-500 mb-1" />
                <span className="font-black font-mono tracking-wider text-sm">CARD TEMPORARILY FROZEN</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Card Controls */}
        <div className="md:col-span-6 space-y-4">
          {/* Quick Security Toggles */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsFrozen(!isFrozen)}
              className={`p-3 rounded-xl border-2 border-neutral-950 flex items-center justify-center gap-2 font-black text-xs transition-all ${
                isFrozen
                  ? 'bg-rose-100 text-rose-800 shadow-[3px_3px_0px_#0A0A0A]'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900 shadow-[3px_3px_0px_#0A0A0A]'
              }`}
            >
              {isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4 text-[#E11D48]" />}
              <span>{isFrozen ? 'UNFREEZE CARD' : 'FREEZE CARD'}</span>
            </button>

            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className="p-3 bg-white hover:bg-neutral-100 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center gap-2 font-black text-xs text-neutral-900 transition-all"
            >
              {showNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-neutral-700" />}
              <span>{showNumbers ? 'HIDE DETAILS' : 'REVEAL CARD'}</span>
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border-2 border-neutral-950">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
              <span>DAILY SPEND LIMIT</span>
              <span className="font-mono text-sm font-black text-[#E11D48]">
                ${dailyLimit.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full accent-[#E11D48] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
              <span>Min: $500</span>
              <span>Max: $10,000 / day</span>
            </div>
          </div>

          {/* Auto-Debit Funding Pool */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-neutral-950 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-neutral-800">Direct Funding Source:</span>
            </div>
            <span className="font-mono font-bold text-neutral-950 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
              USDT (Arbitrum L2)
            </span>
          </div>

          {/* Mobile Wallet Integration */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button className="flex-1 nb-btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-neutral-900" />
              <span>Apple Pay</span>
            </button>
            <button className="flex-1 nb-btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-neutral-900" />
              <span>Google Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
