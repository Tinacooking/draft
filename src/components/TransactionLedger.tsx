import React, { useState } from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, RefreshCcw, Lock, Search, ExternalLink, Filter, Eye } from 'lucide-react';

interface TransactionLedgerProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'transfers' && (tx.type === 'send' || tx.type === 'receive')) ||
      (filterType === 'checkout' && tx.type === 'checkout') ||
      (filterType === 'swap' && tx.type === 'swap') ||
      (filterType === 'escrow' && tx.type === 'escrow');

    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.memo && tx.memo.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getTxIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-4 h-4 text-rose-600" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'checkout':
        return <ShoppingCart className="w-4 h-4 text-[#E11D48]" />;
      case 'swap':
        return <RefreshCcw className="w-4 h-4 text-sky-600" />;
      case 'escrow':
        return <Lock className="w-4 h-4 text-amber-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-neutral-800" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    if (status === 'confirmed') {
      return (
        <span className="nb-badge bg-emerald-100 text-emerald-950 px-2 py-0.5 text-[10px] font-mono font-bold border border-neutral-950">
          CONFIRMED
        </span>
      );
    }
    if (status === 'escrow_locked') {
      return (
        <span className="nb-badge bg-amber-100 text-amber-950 px-2 py-0.5 text-[10px] font-mono font-bold border border-neutral-950">
          ESCROW LOCKED
        </span>
      );
    }
    return (
      <span className="nb-badge bg-sky-100 text-sky-950 px-2 py-0.5 text-[10px] font-mono font-bold border border-neutral-950">
        PENDING
      </span>
    );
  };

  return (
    <div id="transaction-ledger-container" className="nb-card p-5 sm:p-6 bg-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-neutral-950 mb-5 gap-3">
        <div>
          <h2 className="text-lg font-black text-neutral-950 tracking-tight uppercase flex items-center gap-2">
            <span>On-Chain Settlement Ledger</span>
            <span className="text-xs bg-[#E11D48] text-white px-2 py-0.5 rounded-full font-mono font-bold border border-neutral-950">
              {filteredTransactions.length} EVENTS
            </span>
          </h2>
          <p className="text-[11px] font-mono text-neutral-500">
            Real-time cryptographic audit log across integrated networks
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'ALL' },
            { id: 'transfers', label: 'TRANSFERS' },
            { id: 'checkout', label: 'POS CHECKOUT' },
            { id: 'swap', label: 'SWAPS' },
            { id: 'escrow', label: 'ESCROW' },
          ].map((tab) => {
            const active = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border-2 border-neutral-950 transition-all ${
                  active
                    ? 'bg-[#E11D48] text-white shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-[1px_1px_0px_#0A0A0A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Filter input */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by tx hash, counterparty address, memo or title..."
          className="nb-input w-full pl-10 pr-4 py-2 text-xs font-mono font-medium text-neutral-900"
        />
      </div>

      {/* Transaction Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-neutral-950 text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">Transaction</th>
              <th className="py-2.5 px-3">Counterparty</th>
              <th className="py-2.5 px-3">Network</th>
              <th className="py-2.5 px-3 text-right">Value (USD)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs font-mono text-neutral-500">
                  No matching on-chain transactions found for current filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-neutral-50 cursor-pointer transition-colors group"
                >
                  {/* Title & Type */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-950 flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#0A0A0A]">
                        {getTxIcon(tx.type)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-950 group-hover:text-[#E11D48] transition-colors">
                          {tx.title}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {tx.timestamp} • Hash: {tx.hash}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Counterparty */}
                  <td className="py-3 px-3 font-mono text-xs text-neutral-700">
                    <span className="truncate block max-w-[150px]">{tx.counterparty}</span>
                  </td>

                  {/* Network */}
                  <td className="py-3 px-3 font-mono text-xs">
                    <span className="bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-800">
                      {tx.network}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="py-3 px-3 text-right font-mono">
                    <div
                      className={`text-xs font-black ${
                        tx.type === 'receive' ? 'text-emerald-700' : 'text-neutral-950'
                      }`}
                    >
                      {tx.type === 'receive' ? '+' : '-'}
                      {tx.amount} {tx.asset}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      ${tx.usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(tx.status)}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(tx);
                      }}
                      className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors"
                      title="Inspect Receipt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
