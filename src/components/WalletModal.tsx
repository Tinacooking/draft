import React from 'react';
import { X, Wallet, Check, ExternalLink, ShieldCheck, Power } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: (walletName: string) => void;
  onDisconnectWallet: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  if (!isOpen) return null;

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', desc: 'Popular Ethereum & EVM extension', popular: true },
    { id: 'phantom', name: 'Phantom', icon: '👻', desc: 'Multi-chain Solana & Ethereum', popular: true },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', desc: 'Self-custody mobile & web', popular: false },
    { id: 'walletconnect', name: 'WalletConnect', icon: '⚡', desc: 'Scan with 300+ mobile wallets', popular: true },
    { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', desc: 'Game-changing security guard', popular: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="nb-card bg-white max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-neutral-950 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-950" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-neutral-950">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold border-2 border-neutral-950 shadow-[2px_2px_0px_#0A0A0A]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
              {walletConnected ? 'Connected Web3 Wallet' : 'Connect Web3 Wallet'}
            </h3>
            <p className="text-[11px] font-mono text-neutral-500">
              Non-custodial sign-in with your preferred provider
            </p>
          </div>
        </div>

        {walletConnected ? (
          <div className="space-y-4">
            <div className="bg-neutral-50 border-2 border-neutral-950 rounded-xl p-4 font-mono">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500 font-bold uppercase">Active Account</span>
                <span className="nb-badge bg-emerald-100 text-emerald-950 px-2 py-0.5 text-[10px] border border-neutral-950">
                  CONNECTED
                </span>
              </div>
              <div className="text-sm font-black text-neutral-950 break-all mb-2">
                {walletAddress}
              </div>
              <div className="text-xs text-neutral-600">
                ENS: <strong className="text-neutral-950">satoshi.eth</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onConnectWallet('Phantom');
                  onClose();
                }}
                className="nb-btn-secondary py-2.5 px-3 text-xs font-bold"
              >
                SWITCH ACCOUNT
              </button>

              <button
                onClick={() => {
                  onDisconnectWallet();
                  onClose();
                }}
                className="nb-btn-primary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Power className="w-3.5 h-3.5" />
                <span>DISCONNECT</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {wallets.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  onConnectWallet(w.name);
                  onClose();
                }}
                className="w-full p-3 rounded-xl border-2 border-neutral-950 bg-white hover:bg-neutral-50 shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <div className="font-black text-xs text-neutral-950 flex items-center gap-2">
                      <span>{w.name}</span>
                      {w.popular && (
                        <span className="bg-[#E11D48] text-white text-[9px] font-mono px-1.5 py-0.2 rounded border border-neutral-950">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {w.desc}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-neutral-400">→</div>
              </button>
            ))}

            <div className="pt-2 text-center">
              <span className="text-[11px] font-mono text-neutral-500">
                By connecting, you agree to the Apy Smart Contract Terms
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
