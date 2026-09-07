import React, { useState } from 'react';
import { Transaction } from '../types';
import { X, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, Download, Hash, ArrowUpRight } from 'lucide-react';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!transaction) return null;

  const copyTxHash = () => {
    navigator.clipboard.writeText(transaction.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setDownloaded(true);
    const receiptData = JSON.stringify(transaction, null, 2);
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${transaction.id}.json`;
    a.click();
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="nb-card bg-white max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-neutral-950 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-950" />
        </button>

        {/* Top Icon & Title */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-neutral-950">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
              Cryptographic Proof
            </span>
            <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
              On-Chain Payment Receipt
            </h3>
          </div>
        </div>

        {/* Main Amount Card */}
        <div className="bg-[#E11D48]/10 border-2 border-neutral-950 rounded-xl p-4 text-center mb-4 shadow-[3px_3px_0px_#0A0A0A]">
          <div className="text-xs font-mono font-bold text-neutral-600 uppercase">
            Settlement Amount
          </div>
          <div className="text-3xl font-black font-mono text-neutral-950 my-1">
            {transaction.amount} {transaction.asset}
          </div>
          <div className="text-xs font-mono font-bold text-[#E11D48]">
            ≈ ${transaction.usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </div>
        </div>

        {/* Key-Value Details */}
        <div className="space-y-2.5 font-mono text-xs border-2 border-neutral-950 rounded-xl p-4 bg-neutral-50 mb-5">
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Status:</span>
            <span className="nb-badge bg-emerald-100 text-emerald-950 px-2 py-0.5 text-[10px] border border-neutral-950">
              {transaction.status.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Transaction Hash:</span>
            <div className="flex items-center gap-1.5 font-bold text-neutral-950">
              <span>{transaction.hash}</span>
              <button
                onClick={copyTxHash}
                className="p-1 hover:bg-neutral-200 rounded"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Timestamp:</span>
            <span className="font-bold text-neutral-950">{transaction.timestamp}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Network / Chain:</span>
            <span className="font-bold text-neutral-950">{transaction.network}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Counterparty:</span>
            <span className="font-bold text-neutral-950 truncate max-w-[200px]">
              {transaction.counterparty}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Network Gas Fee:</span>
            <span className="font-bold text-neutral-950">{transaction.gasFee}</span>
          </div>

          {transaction.memo && (
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Payment Memo:</span>
              <span className="font-bold text-neutral-950 italic">"{transaction.memo}"</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="nb-btn-secondary py-2.5 px-3 text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? 'DOWNLOADED!' : 'EXPORT JSON'}</span>
          </button>

          <button
            onClick={() => {
              window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank');
            }}
            className="nb-btn-primary py-2.5 px-3 text-xs flex items-center justify-center gap-2"
          >
            <span>EXPLORER</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
