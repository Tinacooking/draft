import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  Mail, 
  ChevronDown, 
  ArrowUpRight, 
  Globe, 
  FolderKanban, 
  Database, 
  CreditCard, 
  Zap, 
  Copy, 
  Check, 
  QrCode, 
  ArrowLeftRight, 
  Send, 
  Download, 
  Store, 
  Plus, 
  Lock, 
  FileText,
  X
} from 'lucide-react';
import { Token, Network, Transaction } from '../types';

interface AppDashboardProps {
  currentNetwork: Network;
  networks: Network[];
  onSelectNetwork: (net: Network) => void;
  walletConnected: boolean;
  walletAddress: string;
  onOpenWalletModal: () => void;
  tokens: Token[];
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenSend: () => void;
  onOpenReceive: () => void;
  onOpenSwap: () => void;
  onOpenInvoiceModal: () => void;
  onOpenPos: () => void;
  onOpenCard: () => void;
  claimedHandle?: string;
}

interface PaymentLinkItem {
  id: string;
  name: string;
  url: string;
  createdDate: string;
  status: 'active' | 'paused';
  revenueUsd: number;
  txCount: number;
  category: string;
  domain: string;
}

export function AppDashboard({
  currentNetwork,
  networks,
  onSelectNetwork,
  walletConnected,
  walletAddress,
  onOpenWalletModal,
  tokens,
  transactions,
  onSelectTransaction,
  onOpenSend,
  onOpenReceive,
  onOpenSwap,
  onOpenInvoiceModal,
  onOpenPos,
  onOpenCard,
  claimedHandle,
}: AppDashboardProps) {
  // Active payment link selection
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkItem[]>([
    {
      id: 'link-1',
      name: 'Kinetic.com',
      url: 'apy.me/kinetic',
      createdDate: '12-07-2025',
      status: 'active',
      revenueUsd: 42800,
      txCount: 142,
      category: 'SaaS & Cloud API',
      domain: 'kinetic.eth',
    },
    {
      id: 'link-2',
      name: 'Bisibisi.com',
      url: 'apy.me/bisibisi',
      createdDate: '16-08-2025',
      status: 'active',
      revenueUsd: 78250,
      txCount: 389,
      category: 'Digital Marketplace',
      domain: 'bisibisi.eth',
    },
    {
      id: 'link-3',
      name: 'Bentonine.com',
      url: 'apy.me/bentonine',
      createdDate: '04-09-2025',
      status: 'active',
      revenueUsd: 18400,
      txCount: 78,
      category: 'Agency & Studio',
      domain: 'bentonine.eth',
    },
  ]);

  const [selectedLinkId, setSelectedLinkId] = useState<string>('link-2');
  const [personalLinkCopied, setPersonalLinkCopied] = useState(false);
  const [personalSlug, setPersonalSlug] = useState(claimedHandle || 'dikta');
  const [activityFilter, setActivityFilter] = useState<'all' | 'incoming' | 'outgoing' | 'pos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    const cleanName = newStoreName.trim();
    const newId = `link-${Date.now()}`;
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
    setPaymentLinks([
      ...paymentLinks,
      {
        id: newId,
        name: cleanName.includes('.') ? cleanName : `${cleanName}.com`,
        url: `apy.me/${slug}`,
        createdDate: 'Today',
        status: 'active',
        revenueUsd: 0,
        txCount: 0,
        category: 'E-Commerce Store',
        domain: `${slug}.eth`,
      }
    ]);
    setSelectedLinkId(newId);
    setNewStoreName('');
    setShowAddStoreModal(false);
    showToast(`Store "${cleanName}" created successfully on Apy Protocol!`);
  };

  const selectedLink = paymentLinks.find((l) => l.id === selectedLinkId) || paymentLinks[1];

  const totalVaultBalance = tokens.reduce((acc, t) => acc + t.balance * t.usdPrice, 0);

  const copyPersonalLink = () => {
    navigator.clipboard.writeText(`https://apy.me/${personalSlug}`);
    setPersonalLinkCopied(true);
    showToast(`Copied https://apy.me/${personalSlug} to clipboard!`);
    setTimeout(() => setPersonalLinkCopied(false), 2000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activityFilter === 'incoming') return tx.type === 'receive' || tx.type === 'checkout';
    if (activityFilter === 'outgoing') return tx.type === 'send';
    if (activityFilter === 'pos') return tx.type === 'checkout';
    return true;
  }).filter((tx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.title.toLowerCase().includes(q) ||
      tx.counterparty.toLowerCase().includes(q) ||
      tx.asset.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 md:py-6 relative">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-neutral-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
              ⚡
            </div>
            <p className="text-xs font-mono text-neutral-200 flex-1 leading-relaxed">
              {toastMessage}
            </p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Minimalist Glass Frame Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[860px]">
        
        {/* Left Rail / Icon Sidebar */}
        <aside className="w-full md:w-18 bg-white/60 border-b md:border-b-0 md:border-r border-neutral-200/80 p-3 flex md:flex-col items-center justify-between gap-4 shrink-0">
          <div className="flex md:flex-col items-center gap-3.5 w-full">
            {/* Apy Brand Icon */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSidebarNav('dashboard')}
              className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-sm shadow-rose-500/25 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
            </motion.div>

            {/* Navigation Icons */}
            <div className="flex md:flex-col items-center gap-2 w-full justify-center">
              {/* Globe / Links Tab */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSidebarNav('dashboard')}
                title="Websites & Stores"
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarNav === 'dashboard'
                    ? 'bg-neutral-950 text-white border-neutral-900 shadow-xs'
                    : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <Globe className="w-4 h-4" />
              </motion.button>

              {/* Merchant POS */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSidebarNav('pos');
                  onOpenPos();
                }}
                title="Merchant POS Terminal"
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarNav === 'pos'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <Store className="w-4 h-4" />
              </motion.button>

              {/* Virtual Debit Card */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSidebarNav('card');
                  onOpenCard();
                }}
                title="Web3 Virtual Debit Card"
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarNav === 'card'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </motion.button>

              {/* Invoices & Escrow */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSidebarNav('invoice');
                  onOpenInvoiceModal();
                }}
                title="Create Smart Invoice"
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarNav === 'invoice'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <FileText className="w-4 h-4" />
              </motion.button>

              {/* Instant DEX Swap */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSidebarNav('swap');
                  onOpenSwap();
                }}
                title="Instant DEX Swap"
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarNav === 'swap'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Bottom Sidebar Action: Beta Tag */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenWalletModal}
              title="Wallet Connection"
              className="w-9 h-9 rounded-2xl bg-white/90 border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4 text-rose-600" />
            </motion.div>
            <span className="text-[9px] font-mono font-bold uppercase text-neutral-400 -rotate-90 py-1">
              BETA
            </span>
          </div>
        </aside>

        {/* Main Application Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F6]/60">
          
          {/* Top Frame Header Bar */}
          <header className="px-4 sm:px-6 py-3.5 border-b border-neutral-200/80 bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions or links..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-white/80 border border-neutral-200/90 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all hover:border-neutral-300"
              />
            </div>

            {/* Right Controls: Network, Bell, Mail, Profile Pill */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              {/* Network Selector Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 text-xs font-mono font-medium shadow-xs hover:border-neutral-300 transition-colors">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentNetwork.color }} />
                <span className="hidden sm:inline text-neutral-700">{currentNetwork.shortName}</span>
                <span className="text-[10px] text-neutral-400">({currentNetwork.gasPriceGwei} gwei)</span>
              </div>

              {/* Notification Bell */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showToast("All systems operational. 3 stealth transactions confirmed on Base L2.")}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center hover:bg-neutral-100 transition-colors relative shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-neutral-700" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </motion.button>

              {/* User Profile Pill */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenWalletModal}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-neutral-900 text-white rounded-full border border-neutral-800 cursor-pointer shadow-xs hover:bg-neutral-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                  D
                </div>
                <span className="text-xs font-mono font-medium">Dikta.eth</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </motion.div>
            </div>
          </header>

          {/* 2-Column Split Dashboard */}
          <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ================= LEFT COLUMN: "Website List" / Payment Links & Personal Link ================= */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold font-mono uppercase tracking-tight text-neutral-900">
                    Website List
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Connected Web3 checkout stores & payment gateways
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddStoreModal(true)}
                  className="w-7 h-7 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-300 shadow-2xs cursor-pointer transition-colors"
                  title="Add new link"
                >
                  <Plus className="w-4 h-4 text-neutral-800" />
                </motion.button>
              </div>

              {/* Add Store Modal */}
              <AnimatePresence>
                {showAddStoreModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-white/95 border border-rose-200 shadow-md space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-rose-600" />
                        Create New Payment Store
                      </span>
                      <button
                        onClick={() => setShowAddStoreModal(false)}
                        className="text-neutral-400 hover:text-neutral-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateStore} className="space-y-2.5">
                      <input
                        type="text"
                        autoFocus
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        placeholder="e.g. AcmePay.com or StudioPay"
                        className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowAddStoreModal(false)}
                          className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-mono hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold shadow-xs transition-colors"
                        >
                          Create Store
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Website Cards List */}
              <div className="space-y-3.5">
                {paymentLinks.map((item) => {
                  const isSelected = item.id === selectedLinkId;

                  return (
                    <motion.div 
                      key={item.id} 
                      className="relative"
                      whileHover={{ scale: 1.015, y: -2 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* The Website Card */}
                      <div
                        onClick={() => setSelectedLinkId(item.id)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-950 text-white border-neutral-900 shadow-md ring-1 ring-neutral-800'
                            : 'bg-white/85 backdrop-blur-sm text-neutral-950 border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Card Top Row: Globe + Name + Arrow Up-Right */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-2.5">
                            <Globe className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-neutral-500'}`} />
                            <span className="text-base sm:text-lg font-bold tracking-tight font-mono">
                              {item.name}
                            </span>
                          </div>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            isSelected ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Card Bottom Row: Action Pills */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPos();
                            }}
                            className={`py-1 px-3 rounded-full border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-white text-neutral-950 border-white hover:bg-neutral-100'
                                : 'bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-neutral-200'
                            }`}
                          >
                            <Store className="w-3 h-3 text-rose-600" />
                            <span>Wp Admin</span>
                          </motion.button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLinkId(item.id);
                            }}
                            className={`text-xs font-mono font-medium flex items-center gap-1 hover:underline cursor-pointer ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-600'
                            }`}
                          >
                            <span>→ Dashboard</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Personal Link Box */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase">
                      Your Personal Link
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-500">
                      Share to get paid directly in any token
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    Instant P2P
                  </span>
                </div>

                {/* Personal Link Box */}
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200 flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                      🌸
                    </div>
                    <span className="text-xs font-mono font-semibold text-neutral-900 truncate">
                      apy.me/{personalSlug}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={copyPersonalLink}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700"
                      title="Copy Link"
                    >
                      {personalLinkCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={onOpenReceive}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700"
                      title="Show QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onOpenPos}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700"
                      title="Open Checkout Preview"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Slug Input */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={personalSlug}
                    onChange={(e) => setPersonalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="Custom handle"
                    className="flex-1 py-1 px-3 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    onClick={copyPersonalLink}
                    className="py-1 px-3 bg-neutral-900 text-white rounded-lg text-xs font-mono font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Supported Multi-Chain Tokens Pill Shelf */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-neutral-200/80 shadow-xs">
                <span className="text-xs font-mono font-bold text-neutral-700 block mb-2">
                  Supported Vault Assets
                </span>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="px-2.5 py-1 rounded-xl bg-neutral-50/80 border border-neutral-200/80 flex items-center gap-1.5 text-xs font-mono"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: token.iconBg }} />
                      <span className="font-bold text-neutral-900">{token.symbol}</span>
                      <span className="text-neutral-500">${token.usdPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= RIGHT COLUMN: Selected Store Details, Services, Gauge & Activity ================= */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header Details */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold font-mono uppercase tracking-tight text-neutral-900">
                  Dashboard Overview
                </h2>
                <span className="text-xs font-mono text-neutral-500 font-medium">
                  Live Vault: <span className="text-neutral-900 font-bold">${totalVaultBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </span>
              </div>

              {/* 1. Hero Card */}
              <div className="bg-gradient-to-tr from-rose-600 to-rose-500 text-white p-5 sm:p-6 rounded-3xl border border-rose-400/40 shadow-sm shadow-rose-600/15 relative overflow-hidden group hover:shadow-lg hover:shadow-rose-600/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-white/80 font-medium mb-1">
                      ACTIVE STOREFRONT / VAULT
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      {selectedLink.name}
                    </h3>
                  </div>

                  {/* WP Admin Pill */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenPos}
                    className="py-1.5 px-3.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-mono font-semibold border border-white/30 flex items-center gap-1.5 hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Wp Admin</span>
                  </motion.button>
                </div>

                <div className="pt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-white/80 block">Created</span>
                    <span className="text-base sm:text-xl font-mono font-bold text-white">
                      {selectedLink.createdDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onOpenSend}
                      className="py-1.5 px-3.5 rounded-xl bg-white text-rose-700 text-xs font-mono font-bold shadow-xs hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      ⚡ Quick Pay
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onOpenInvoiceModal}
                      className="py-1.5 px-3.5 rounded-xl bg-neutral-950 text-white text-xs font-mono font-bold hover:bg-neutral-900 transition-all cursor-pointer"
                    >
                      + Invoice
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* 2. Service Status Table */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-3">
                {/* Row 1: Domain */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-100 hover:bg-neutral-50/60 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs font-mono font-semibold text-neutral-700">Domain</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-900">{selectedLink.domain}</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showToast(`Domain ${selectedLink.domain} is verified and fully resolved on ENS.`)}
                      className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-mono font-medium hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Upgrade
                    </motion.button>
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600">
                      Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                </div>

                {/* Row 2: Hosting / Settlement Vault */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-100 hover:bg-neutral-50/60 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs font-mono font-semibold text-neutral-700">Hosting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-900">Base L2 Vault</span>
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600">
                      Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                </div>

                {/* Row 3: Webhook & Relayer Mail */}
                <div className="flex items-center justify-between py-2 hover:bg-neutral-50/60 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs font-mono font-semibold text-neutral-700">Mail / Webhooks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showToast("Webhooks: 100% delivered to POS merchant endpoint.")}
                      className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-mono font-medium hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Manage
                    </motion.button>
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600">
                      Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenInvoiceModal}
                  className="py-2 px-4 rounded-xl bg-neutral-900 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <FolderKanban className="w-4 h-4 text-rose-400" />
                  <span>File Manager</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenInvoiceModal}
                  className="py-2 px-4 rounded-xl bg-neutral-900 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4 text-rose-400" />
                  <span>Databases</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenCard}
                  className="py-2 px-4 rounded-xl bg-white text-neutral-900 text-xs font-mono font-semibold border border-neutral-200 flex items-center gap-2 shadow-xs hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <span>Virtual Debit Card</span>
                </motion.button>
              </div>

              {/* 4. Bottom Metrics: Hosting Resource Usage & Circular Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Hosting Resources Usage Card */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-neutral-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs border border-neutral-900"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-neutral-400">
                      Hosting resources usage
                    </span>
                    <span className="text-xl font-mono font-bold text-white">
                      38 GB <span className="text-xs text-neutral-500 font-normal">/200gb</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex p-0.5">
                    <div className="w-[38%] h-full bg-rose-600 rounded-full" />
                  </div>

                  <div className="mt-3 text-right">
                    <button
                      onClick={() => showToast("Treasury Subsidy: 38/200 Gwei gas credits allocated for your account.")}
                      className="text-xs font-mono font-medium text-neutral-400 hover:text-white hover:underline flex items-center justify-end gap-1 ml-auto cursor-pointer"
                    >
                      <span>→ See Details</span>
                    </button>
                  </div>
                </motion.div>

                {/* PageSpeed Insights Circular Score Gauge */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-neutral-200/80 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-800">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold">
                        G
                      </span>
                      <span>PageSpeed Insights</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                      Desktop device • Last scan 2026-09-07
                    </div>
                  </div>

                  {/* Circular Score Gauge Ring */}
                  <div className="flex items-center justify-center my-2">
                    <div className="relative w-20 h-20 flex items-center justify-center group cursor-default">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#F3F4F6"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E11D48"
                          strokeWidth="3.8"
                          strokeDasharray="95, 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-mono font-black text-neutral-950 group-hover:scale-110 transition-transform">
                        95
                      </span>
                    </div>
                  </div>

                  <div className="text-center text-[11px] font-mono font-bold text-emerald-600">
                    Excellent • 0.2s Finality
                  </div>
                </motion.div>
              </div>

              {/* 5. Activities Feed */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200 w-fit">
                    {(['all', 'incoming', 'outgoing', 'pos'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActivityFilter(tab)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-medium capitalize transition-all cursor-pointer ${
                          activityFilter === tab
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                        }`}
                      >
                        {tab === 'pos' ? 'POS/Gifts' : tab}
                      </button>
                    ))}
                  </div>

                  {/* Export CSV Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        "ID,Hash,Type,Asset,Amount,USD,Status,Timestamp\n" +
                        transactions.map(t => `${t.id},${t.hash},${t.type},${t.asset},${t.amount},${t.usdAmount},${t.status},${t.timestamp}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `apy-transactions-${Date.now()}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("Exported transaction ledger to CSV.");
                    }}
                    className="py-1 px-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 text-xs font-mono font-medium flex items-center gap-1.5 hover:bg-neutral-100 hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </motion.button>
                </div>

                {/* Transaction Rows */}
                <div className="divide-y divide-neutral-100">
                  {filteredTransactions.slice(0, 4).map((tx) => (
                    <motion.div
                      key={tx.id}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => onSelectTransaction(tx)}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-rose-50/50 px-2 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Token / Type Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-110 ${
                          tx.type === 'receive' || tx.type === 'checkout'
                            ? 'bg-emerald-100 text-emerald-700'
                            : tx.type === 'send'
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {tx.type === 'receive' || tx.type === 'checkout' ? '↓' : tx.type === 'send' ? '↑' : '⇄'}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-mono font-bold text-neutral-900 truncate group-hover:text-rose-600 transition-colors">
                            {tx.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                            <span>{tx.counterparty}</span>
                            <span>•</span>
                            <span>{tx.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Amount & Tags */}
                      <div className="text-right shrink-0">
                        <div className={`text-xs sm:text-sm font-mono font-bold ${
                          tx.type === 'receive' || tx.type === 'checkout'
                            ? 'text-emerald-600'
                            : 'text-neutral-900'
                        }`}>
                          {tx.type === 'receive' || tx.type === 'checkout' ? '+' : '-'} {tx.amount} {tx.asset}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">
                          ${tx.usdAmount.toLocaleString()} USD
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 text-center pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-mono text-neutral-500">
                    Click any transaction to view cryptographic on-chain receipt proof
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
