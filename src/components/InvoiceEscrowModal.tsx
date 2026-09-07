import React, { useState } from 'react';
import { X, FileText, Check, Copy, Link, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Transaction } from '../types';

interface InvoiceEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (tx: Transaction) => void;
}

export const InvoiceEscrowModal: React.FC<InvoiceEscrowModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated,
}) => {
  const [clientAddress, setClientAddress] = useState('');
  const [title, setTitle] = useState('Smart Contract Audit & Frontend Dev');
  const [amountUsd, setAmountUsd] = useState('1850.00');
  const [token, setToken] = useState('USDC');
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [milestoneDays, setMilestoneDays] = useState('14');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceId = `APY-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const payLink = `https://apy.me/pay/${invoiceId}?amt=${amountUsd}&token=${token}&escrow=${enableEscrow}`;
    setGeneratedLink(payLink);

    // Also register an escrow or pending invoice in transactions
    const newTx: Transaction = {
      id: `inv-${Date.now()}`,
      hash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      type: enableEscrow ? 'escrow' : 'checkout',
      title: `Invoice #${invoiceId}: ${title}`,
      asset: token,
      amount: parseFloat(amountUsd),
      usdAmount: parseFloat(amountUsd),
      counterparty: clientAddress || 'client.eth (Unassigned)',
      timestamp: 'Just now',
      status: enableEscrow ? 'escrow_locked' : 'pending',
      network: 'Base L2',
      gasFee: '$0.002',
      memo: enableEscrow ? `Locked in 2-of-3 Smart Escrow (${milestoneDays} days)` : 'Direct Web3 Invoice',
    };
    onInvoiceCreated(newTx);
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="nb-card bg-white max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-neutral-950 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-950" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-neutral-950">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
              Create Web3 Invoice & Smart Escrow
            </h3>
            <p className="text-[11px] font-mono text-neutral-500">
              Generate non-custodial crypto payment request with automated release
            </p>
          </div>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                ITEM / SERVICE DESCRIPTION
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="nb-input w-full px-3.5 py-2 text-xs font-bold text-neutral-900"
                placeholder="e.g. Design Tokens & Frontend Integration"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  AMOUNT (USD)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="nb-input w-full px-3.5 py-2 text-xs font-mono font-bold text-neutral-900"
                  placeholder="1500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  SETTLEMENT ASSET
                </label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="nb-input w-full px-3.5 py-2 text-xs font-bold text-neutral-900 bg-white"
                >
                  <option value="USDC">USDC (Stable)</option>
                  <option value="USDT">USDT (Tether)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="SOL">SOL (Solana)</option>
                  <option value="RED">RED (Zero-Fee)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                CLIENT WALLET / ENS (OPTIONAL)
              </label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="e.g. client.eth or 0x..."
                className="nb-input w-full px-3.5 py-2 text-xs font-mono font-medium text-neutral-900"
              />
            </div>

            {/* Smart Escrow Protection Toggle */}
            <div className="bg-neutral-50 border-2 border-neutral-950 p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#E11D48]" />
                  <span className="text-xs font-bold text-neutral-900">
                    Enable Smart Contract Escrow
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableEscrow}
                  onChange={(e) => setEnableEscrow(e.target.checked)}
                  className="w-4 h-4 accent-[#E11D48] cursor-pointer"
                />
              </div>

              {enableEscrow && (
                <div className="pt-2 border-t border-neutral-200">
                  <label className="block text-[11px] font-mono text-neutral-600 mb-1">
                    Auto-release window upon milestone approval:
                  </label>
                  <select
                    value={milestoneDays}
                    onChange={(e) => setMilestoneDays(e.target.value)}
                    className="nb-input w-full px-3 py-1.5 text-xs font-bold bg-white"
                  >
                    <option value="7">7 Days Inspection Period</option>
                    <option value="14">14 Days Standard Escrow</option>
                    <option value="30">30 Days Enterprise Milestone</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full nb-btn-primary py-3 px-4 text-xs font-black uppercase flex items-center justify-center gap-2"
            >
              <span>GENERATE WEB3 INVOICE LINK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center">
              <span className="nb-badge bg-emerald-200 text-emerald-900 px-3 py-1 text-xs font-bold">
                PAYMENT LINK READY
              </span>
              <p className="text-xs font-mono text-neutral-700 mt-2">
                Share this link with your client. Payment will route directly to your connected wallet upon confirmation.
              </p>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border-2 border-neutral-950 font-mono text-xs break-all">
              {generatedLink}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyLink}
                className="nb-btn-primary py-2.5 px-3 text-xs flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
              </button>
              <button
                onClick={() => setGeneratedLink(null)}
                className="nb-btn-secondary py-2.5 px-3 text-xs"
              >
                CREATE ANOTHER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
