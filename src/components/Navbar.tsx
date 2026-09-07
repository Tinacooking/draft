import React from 'react';
import { Network } from '../types';
import { Wallet, ChevronDown, Check, Zap, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentNetwork: Network;
  networks: Network[];
  onSelectNetwork: (network: Network) => void;
  walletConnected: boolean;
  walletAddress: string;
  onToggleWallet: () => void;
  onOpenWalletModal: () => void;
  activeFilterTab: string;
  setActiveFilterTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentNetwork,
  networks,
  onSelectNetwork,
  walletConnected,
  walletAddress,
  onOpenWalletModal,
  activeFilterTab,
  setActiveFilterTab,
}) => {
  const [networkDropdownOpen, setNetworkDropdownOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'pay', label: 'SEND & SWAP' },
    { id: 'checkout', label: 'MERCHANT POS' },
    { id: 'ledger', label: 'LIVE LEDGER' },
    { id: 'card', label: 'VIRTUAL CARD' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F5] border-b-2 border-neutral-950 px-4 lg:px-8 py-3.5 shadow-[0px_4px_0px_#0A0A0A]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Protocol status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 bg-[#E11D48] text-white font-black text-xl flex items-center justify-center rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] tracking-tighter">
              R⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter text-neutral-950 flex items-center">
                  RED<span className="text-[#E11D48]">PAY</span>
                </span>
                <span className="bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-neutral-950 shadow-[1.5px_1.5px_0px_#0A0A0A]">
                  WEB3 PROTOCOL
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-600 font-semibold tracking-tight">
                NON-CUSTODIAL INSTANT SETTLEMENT
              </p>
            </div>
          </div>

          {/* Quick filter pills on mobile or nav tabs */}
          <div className="hidden lg:flex items-center gap-1.5 ml-6 bg-white p-1 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A]">
            {navTabs.map((tab) => {
              const active = activeFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveFilterTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-black tracking-wide rounded-lg transition-all ${
                    active
                      ? 'bg-[#E11D48] text-white border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border-2 border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right tools: Network switch, Gas badge, Wallet button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 w-full md:w-auto justify-end flex-wrap">
          {/* Gas / Speed Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Zap className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>{currentNetwork.gasPriceGwei} GWEI</span>
            <span className="text-[10px] text-neutral-500 font-sans font-bold bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-300">
              FAST
            </span>
          </div>

          {/* Network Switcher Dropdown */}
          <div className="relative">
            <button
              id="network-selector-btn"
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              className="flex items-center gap-2 bg-white hover:bg-neutral-50 px-3 py-1.5 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] font-bold text-xs transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A]"
            >
              <div
                className="w-3 h-3 rounded-full border border-neutral-950"
                style={{ backgroundColor: currentNetwork.color }}
              />
              <span className="hidden xs:inline">{currentNetwork.name}</span>
              <span className="xs:hidden font-mono">{currentNetwork.shortName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
            </button>

            {networkDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border-2 border-neutral-950 shadow-[5px_5px_0px_#0A0A0A] p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 border-b border-neutral-200 mb-1 text-[11px] font-mono font-bold text-neutral-500 uppercase">
                  Select Blockchain Network
                </div>
                {networks.map((net) => (
                  <button
                    key={net.id}
                    id={`network-option-${net.id}`}
                    onClick={() => {
                      onSelectNetwork(net);
                      setNetworkDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      net.id === currentNetwork.id
                        ? 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-neutral-950"
                        style={{ backgroundColor: net.color }}
                      />
                      <span>{net.name}</span>
                    </div>
                    {net.id === currentNetwork.id && <Check className="w-4 h-4 text-[#E11D48]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Connect Badge / Action */}
          {walletConnected ? (
            <div
              id="wallet-info-badge"
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 bg-[#E11D48] text-white px-3 py-1.5 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_#0A0A0A] font-mono font-bold text-xs cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-950"></div>
              <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              <button
                onClick={copyAddress}
                title="Copy Address"
                className="p-1 hover:bg-black/20 rounded transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <button
              id="connect-wallet-main-btn"
              onClick={onOpenWalletModal}
              className="nb-btn-primary px-4 py-1.5 text-xs flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>CONNECT WALLET</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav pills */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 -mx-2 px-2 scrollbar-none">
        {navTabs.map((tab) => {
          const active = activeFilterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1 text-xs font-black whitespace-nowrap rounded-lg border-2 border-neutral-950 transition-all ${
                active
                  ? 'bg-[#E11D48] text-white shadow-[2px_2px_0px_#0A0A0A]'
                  : 'bg-white text-neutral-800 shadow-[1px_1px_0px_#0A0A0A]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
