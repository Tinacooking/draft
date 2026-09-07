import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { AppDashboard } from './components/AppDashboard';
import { TickerBar } from './components/TickerBar';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { QuickPayment } from './components/QuickPayment';
import { MerchantCheckoutPOS } from './components/MerchantCheckoutPOS';
import { Web3DebitCard } from './components/Web3DebitCard';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { InvoiceEscrowModal } from './components/InvoiceEscrowModal';
import { WalletModal } from './components/WalletModal';
import { SUPPORTED_NETWORKS, INITIAL_TOKENS, INITIAL_TRANSACTIONS } from './data/mockData';
import { Token, Network, Transaction } from './types';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  ArrowLeftRight, 
  Globe, 
  Zap, 
  Layers, 
  CreditCard, 
  ExternalLink,
  Store,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function App() {
  // Master Frame Tab state requested: 
  // Tab 1: Landing Page
  // Tab 2: App Dashboard
  const [masterTab, setMasterTab] = useState<'landing' | 'app'>('landing');
  const [claimedHandle, setClaimedHandle] = useState<string>('satoshivault');

  // Core Web3 state
  const [networks] = useState<Network[]>(SUPPORTED_NETWORKS);
  const [currentNetwork, setCurrentNetwork] = useState<Network>(SUPPORTED_NETWORKS[0]);
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [selectedToken, setSelectedToken] = useState<Token>(INITIAL_TOKENS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Wallet state
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('0x71C288E298d0249B2A7513C35C8e4b7F2e1B182');

  // Modals & Drawers
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [receiptModalTx, setReceiptModalTx] = useState<Transaction | null>(null);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Quick Swap state
  const [swapFromToken, setSwapFromToken] = useState<Token>(INITIAL_TOKENS[0]); // USDT
  const [swapToToken, setSwapToToken] = useState<Token>(INITIAL_TOKENS[4]); // RED
  const [swapAmount, setSwapAmount] = useState('500');
  const [copiedReceive, setCopiedReceive] = useState(false);

  // Transaction Handler
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.type === 'send') {
      setTokens((prev) =>
        prev.map((t) =>
          t.symbol === newTx.asset ? { ...t, balance: Math.max(0, t.balance - newTx.amount) } : t
        )
      );
    } else if (newTx.type === 'checkout' || newTx.type === 'receive') {
      setTokens((prev) =>
        prev.map((t) =>
          t.symbol === newTx.asset ? { ...t, balance: t.balance + newTx.amount } : t
        )
      );
    }
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(swapAmount) || 0;
    if (amountNum <= 0) return;

    const rate = swapFromToken.usdPrice / swapToToken.usdPrice;
    const receivedAmount = amountNum * rate;

    const swapTx: Transaction = {
      id: `swap-${Date.now()}`,
      hash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      type: 'swap',
      title: `DEX Swap: ${amountNum} ${swapFromToken.symbol} -> ${receivedAmount.toFixed(2)} ${swapToToken.symbol}`,
      asset: swapToToken.symbol,
      amount: receivedAmount,
      usdAmount: amountNum * swapFromToken.usdPrice,
      counterparty: 'Apy Uniswap V3 Pool Router',
      timestamp: 'Just now',
      status: 'confirmed',
      network: currentNetwork.name,
      gasFee: '$0.003',
      memo: 'Zero Slippage Cross-Pool Swap',
    };

    handleAddTransaction(swapTx);
    setSwapModalOpen(false);
  };

  const copyReceiveAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedReceive(true);
    setTimeout(() => setCopiedReceive(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]/80 text-neutral-900 font-sans selection:bg-rose-600 selection:text-white flex flex-col relative">
      
      {/* Background Animated Layer with interactive ambient lights and cursor tracking */}
      <BackgroundAnimation />

      {/* ================= SINGLE UNIFIED MINIMALIST GLASS HEADER ================= */}
      {/* Sleek frosted glass header with Apy brand, segmented switcher, docs & launch app */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-neutral-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand "apy" with glowing dot */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => {
              setMasterTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span>⚡</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-neutral-950 font-sans group-hover:text-rose-600 transition-colors">
                apy
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="hidden sm:inline-block ml-1 px-2 py-0.5 rounded-full bg-rose-50/90 text-rose-600 text-[10px] font-mono font-bold border border-rose-100/90 group-hover:border-rose-200 group-hover:bg-rose-100/80 transition-colors">
                stealth web3
              </span>
            </div>
          </div>

          {/* Center: Minimalist Glass Segmented Switcher */}
          <div className="flex items-center p-1 rounded-full bg-neutral-100/90 backdrop-blur-md border border-neutral-200/70 shadow-inner">
            <button
              id="tab-btn-landing"
              onClick={() => {
                setMasterTab('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                masterTab === 'landing'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/70 font-bold scale-[1.02]'
                  : 'text-neutral-500 hover:text-neutral-900 hover:scale-105'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-12 ${masterTab === 'landing' ? 'text-rose-600' : 'text-neutral-400'}`} />
              <span>Landing Page</span>
            </button>

            <button
              id="tab-btn-app"
              onClick={() => {
                setMasterTab('app');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                masterTab === 'app'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/70 font-bold scale-[1.02]'
                  : 'text-neutral-500 hover:text-neutral-900 hover:scale-105'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${masterTab === 'app' ? 'text-rose-600' : 'text-neutral-400'}`} />
              <span>Web3 App</span>
            </button>
          </div>

          {/* Right: Docs, X & Action */}
          <div className="flex items-center gap-3">
            <a
              href="#faq"
              onClick={() => {
                if (masterTab !== 'landing') setMasterTab('landing');
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/90 hover:scale-105 active:scale-95 transition-all font-mono"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>Docs</span>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/90 hover:scale-105 active:scale-95 transition-all font-mono"
            >
              <span>Follow on</span>
              <span className="font-bold">𝕏</span>
            </a>

            {masterTab === 'landing' ? (
              <button
                onClick={() => {
                  setMasterTab('app');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-shimmer py-1.5 px-4 sm:px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-rose-500/25 transition-all duration-200 flex items-center gap-1.5 font-mono hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-rose-500/30"
              >
                <span>Launch App</span>
                <span className="text-white/80 group-hover:translate-x-0.5 transition-transform">↗</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-white/90 border border-neutral-200/90 text-neutral-800 text-xs font-mono font-medium hover:border-rose-300 shadow-xs flex items-center gap-1.5 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ================= MASTER SCREENS / TABS WITH DYNAMIC TRANSITIONS ================= */}
      <AnimatePresence mode="wait">
        {masterTab === 'landing' ? (
          <motion.div
            key="screen-landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <LandingPage
              onLaunchApp={(customHandle?: string) => {
                if (customHandle) {
                  setClaimedHandle(customHandle);
                }
                setMasterTab('app');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              tokens={tokens}
            />
          </motion.div>
        ) : (
          <motion.div
            key="screen-app-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            {/* Ticker Bar */}
            <TickerBar tokens={tokens} />

            {/* Sub-Banner Alert - Sleek Glassmorphic & Rose Gradient */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
              <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white p-3 sm:p-3.5 rounded-2xl border border-rose-400/30 shadow-sm shadow-rose-600/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-white/20 backdrop-blur-sm text-white rounded-lg flex items-center justify-center font-bold text-xs border border-white/30">
                    ⚡
                  </div>
                  <div className="text-xs font-mono font-bold tracking-tight">
                    <span className="tracking-wide">ZERO-GAS SPONSORSHIP ACTIVE:</span>{' '}
                    <span className="text-white/90 font-normal">
                      Settlements on Base L2 & Arbitrum are currently subsidized by Protocol Treasury.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-mono font-bold text-xs shadow-xs transition-all whitespace-nowrap"
                  >
                    + CREATE INVOICE
                  </button>
                </div>
              </div>
            </div>

            {/* Redesigned App Dashboard */}
            <main className="flex-1">
              <AppDashboard
                currentNetwork={currentNetwork}
                networks={networks}
                onSelectNetwork={setCurrentNetwork}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                onOpenWalletModal={() => setWalletModalOpen(true)}
                tokens={tokens}
                transactions={transactions}
                onSelectTransaction={(tx) => setReceiptModalTx(tx)}
                onOpenSend={() => setSendModalOpen(true)}
                onOpenReceive={() => setReceiveModalOpen(true)}
                onOpenSwap={() => setSwapModalOpen(true)}
                onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
                onOpenPos={() => setPosModalOpen(true)}
                onOpenCard={() => setCardModalOpen(true)}
                claimedHandle={claimedHandle}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DIALOGS ================= */}

      {/* 1. Quick Send Crypto Modal */}
      {sendModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSendModalOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neutral-950 text-white border-2 border-white flex items-center justify-center hover:bg-neutral-800 z-10 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            <QuickPayment
              tokens={tokens}
              currentNetwork={currentNetwork}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              onPaymentSuccess={(tx) => {
                handleAddTransaction(tx);
                setTimeout(() => setSendModalOpen(false), 2000);
              }}
            />
          </div>
        </div>
      )}

      {/* 2. Merchant Checkout POS Modal */}
      {posModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPosModalOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neutral-950 text-white border-2 border-white flex items-center justify-center hover:bg-neutral-800 z-10 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            <MerchantCheckoutPOS
              onPaymentSettled={(tx) => {
                handleAddTransaction(tx);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Web3 Virtual Debit Card Modal */}
      {cardModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCardModalOpen(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-neutral-950 text-white border-2 border-white flex items-center justify-center hover:bg-neutral-800 z-10 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            <Web3DebitCard />
          </div>
        </div>
      )}

      {/* 4. Transaction Receipt Cryptographic Proof Modal */}
      <TransactionReceiptModal
        transaction={receiptModalTx}
        onClose={() => setReceiptModalTx(null)}
      />

      {/* 5. Web3 Invoice & Smart Escrow Generator Modal */}
      <InvoiceEscrowModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onInvoiceCreated={(tx) => {
          handleAddTransaction(tx);
          setInvoiceModalOpen(false);
        }}
      />

      {/* 6. Connect Wallet & Account Switcher Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={() => {
          setWalletConnected(true);
          setWalletAddress('0x892a06368E343699F81304ae160ECe0d0263f64b');
        }}
        onDisconnectWallet={() => {
          setWalletConnected(false);
          setWalletAddress('0x0000...0000');
        }}
      />

      {/* 7. Receive QR Code Modal */}
      {receiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="nb-card bg-white max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 text-center">
            <button
              onClick={() => setReceiveModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-neutral-950 hover:bg-neutral-100"
            >
              <X className="w-4 h-4 text-neutral-950" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A] mx-auto mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
              Receive Multi-Chain Assets
            </h3>
            <p className="text-xs font-mono text-neutral-500 mb-4">
              Supports ETH, USDT, USDC, SOL on Ethereum, Base, Arbitrum & Solana
            </p>

            {/* Visual QR Container */}
            <div className="p-4 bg-neutral-50 rounded-xl border-2 border-neutral-950 mb-4 inline-block shadow-[3px_3px_0px_#0A0A0A]">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0A0A0A" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#E11D48" />

                <rect x="65" y="10" width="25" height="25" fill="#0A0A0A" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#E11D48" />

                <rect x="10" y="65" width="25" height="25" fill="#0A0A0A" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#E11D48" />

                <rect x="42" y="12" width="16" height="8" fill="#0A0A0A" />
                <rect x="42" y="25" width="8" height="15" fill="#0A0A0A" />
                <rect x="42" y="45" width="16" height="16" fill="#E11D48" rx="3" />
                <rect x="12" y="42" width="12" height="12" fill="#0A0A0A" />
                <rect x="65" y="42" width="25" height="8" fill="#0A0A0A" />
                <rect x="42" y="70" width="15" height="18" fill="#0A0A0A" />
                <rect x="65" y="65" width="25" height="25" fill="#0A0A0A" />
              </svg>
            </div>

            {/* Address Box */}
            <div className="bg-neutral-50 p-2.5 rounded-xl border-2 border-neutral-950 font-mono text-xs mb-4">
              <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Your Wallet Address</div>
              <div className="font-bold text-neutral-950 truncate">{walletAddress}</div>
            </div>

            <button
              onClick={copyReceiveAddress}
              className="nb-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
            >
              {copiedReceive ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReceive ? 'ADDRESS COPIED!' : 'COPY DEPOSIT ADDRESS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. Quick DEX Swap Modal */}
      {swapModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="nb-card bg-white max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSwapModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-neutral-950 hover:bg-neutral-100"
            >
              <X className="w-4 h-4 text-neutral-950" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-neutral-950">
              <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                  Instant DEX Swap
                </h3>
                <p className="text-[11px] font-mono text-neutral-500">
                  Best price execution via RedPay Smart Router
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteSwap} className="space-y-4">
              {/* Pay From */}
              <div className="p-3 bg-neutral-50 rounded-xl border-2 border-neutral-950">
                <div className="flex justify-between text-xs font-mono text-neutral-500 mb-1">
                  <span>YOU PAY</span>
                  <span>Bal: {swapFromToken.balance.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="w-full bg-transparent text-xl font-black font-mono focus:outline-none"
                    placeholder="0.00"
                  />
                  <select
                    value={swapFromToken.id}
                    onChange={(e) => {
                      const t = tokens.find((tok) => tok.id === e.target.value);
                      if (t) setSwapFromToken(t);
                    }}
                    className="nb-input py-1 px-2 text-xs font-bold bg-white"
                  >
                    {tokens.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Receive To */}
              <div className="p-3 bg-neutral-50 rounded-xl border-2 border-neutral-950">
                <div className="flex justify-between text-xs font-mono text-neutral-500 mb-1">
                  <span>YOU RECEIVE (ESTIMATED)</span>
                  <span>Bal: {swapToToken.balance.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full text-xl font-black font-mono text-emerald-700">
                    {(
                      ((parseFloat(swapAmount) || 0) * swapFromToken.usdPrice) /
                      swapToToken.usdPrice
                    ).toFixed(2)}
                  </div>
                  <select
                    value={swapToToken.id}
                    onChange={(e) => {
                      const t = tokens.find((tok) => tok.id === e.target.value);
                      if (t) setSwapToToken(t);
                    }}
                    className="nb-input py-1 px-2 text-xs font-bold bg-white"
                  >
                    {tokens.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-600 bg-white p-2.5 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex justify-between">
                  <span>Slippage Tolerance:</span>
                  <span className="font-bold text-emerald-700">0.1% (Guaranteed)</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span className="font-bold text-neutral-950">$0.003</span>
                </div>
              </div>

              <button
                type="submit"
                className="nb-btn-primary w-full py-3 text-xs font-black uppercase flex items-center justify-center gap-2"
              >
                <span>CONFIRM SWAP TRANSACTION</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="bg-white border-t-2 border-neutral-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#E11D48] rounded-full border border-neutral-950" />
            <span className="font-bold text-neutral-950">REDPAY PROTOCOL</span>
            <span>• Non-Custodial Multi-Chain Web3 Settlement Standard</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setMasterTab('landing')} className="hover:text-[#E11D48]">
              Tab 1: Landing
            </button>
            <span className="text-neutral-300">|</span>
            <button onClick={() => setMasterTab('app')} className="hover:text-[#E11D48]">
              Tab 2: Web3 App
            </button>
            <span className="text-neutral-300">|</span>
            <span>CertiK Audited</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
