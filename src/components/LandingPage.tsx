import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  Copy, 
  BookOpen, 
  Link2, 
  Wallet, 
  Lock, 
  ListOrdered, 
  RefreshCw, 
  ShoppingBag, 
  Send, 
  Info,
  CheckCircle2,
  Sliders,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
  MousePointerClick
} from 'lucide-react';
import { Token } from '../types';

interface LandingPageProps {
  onLaunchApp: (customHandle?: string) => void;
  tokens: Token[];
}

export const SCREEN_FRAMES = [
  { id: 'frame-hero', num: '01', title: 'Hero', subtitle: 'Stealth Payments' },
  { id: 'frame-pillars', num: '02', title: 'Pillars', subtitle: 'Core Values' },
  { id: 'frame-showcase', num: '03', title: 'Interface', subtitle: '3-Device & Bento' },
  { id: 'frame-calculator', num: '04', title: 'Calculator', subtitle: 'Fee Savings' },
  { id: 'frame-banner', num: '05', title: 'Apy Up', subtitle: 'Claim Link' },
  { id: 'frame-faq', num: '06', title: 'FAQs', subtitle: 'Protocol Specs' },
];

export function LandingPage({ onLaunchApp, tokens }: LandingPageProps) {
  // Username claim input in Hero
  const [handle, setHandle] = useState('satoshivault');
  const [isClaimed, setIsClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Phone Mockup interactive state in Hero
  const [phoneTab, setPhoneTab] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [previewVolume, setPreviewVolume] = useState(35000);

  // 3-Phone Screen Interface active tab state
  const [activeScreenIndex, setActiveScreenIndex] = useState(1);

  // Accordion open/close state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active Screen Frame tracking on scroll
  const [activeFrameId, setActiveFrameId] = useState('frame-hero');
  const [snapMode, setSnapMode] = useState(true); // 1 scroll = 1 frame glide mode

  // 3D Hero Phone Perspective & Interactive Tilt State
  const [view3DMode, setView3DMode] = useState<'isometric' | 'dramatic' | 'front'>('isometric');
  const [phoneRotateX, setPhoneRotateX] = useState(13);
  const [phoneRotateY, setPhoneRotateY] = useState(-18);
  const [phoneRotateZ, setPhoneRotateZ] = useState(3);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  // Mouse move handler over 3D Hero phone
  const handlePhoneMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5

    const baseRx = view3DMode === 'isometric' ? 13 : view3DMode === 'dramatic' ? 24 : 4;
    const baseRy = view3DMode === 'isometric' ? -18 : view3DMode === 'dramatic' ? -28 : -4;
    const baseRz = view3DMode === 'isometric' ? 3 : view3DMode === 'dramatic' ? 6 : 0;

    setPhoneRotateX(baseRx - y * 22);
    setPhoneRotateY(baseRy + x * 26);
    setPhoneRotateZ(baseRz + x * 3);
    setIsPhoneHovered(true);
  }, [view3DMode]);

  const handlePhoneMouseLeave = useCallback(() => {
    setIsPhoneHovered(false);
    if (view3DMode === 'isometric') {
      setPhoneRotateX(13);
      setPhoneRotateY(-18);
      setPhoneRotateZ(3);
    } else if (view3DMode === 'dramatic') {
      setPhoneRotateX(24);
      setPhoneRotateY(-28);
      setPhoneRotateZ(6);
    } else {
      setPhoneRotateX(4);
      setPhoneRotateY(-4);
      setPhoneRotateZ(0);
    }
  }, [view3DMode]);

  const switch3DMode = (mode: 'isometric' | 'dramatic' | 'front') => {
    setView3DMode(mode);
    if (mode === 'isometric') {
      setPhoneRotateX(13);
      setPhoneRotateY(-18);
      setPhoneRotateZ(3);
    } else if (mode === 'dramatic') {
      setPhoneRotateX(24);
      setPhoneRotateY(-28);
      setPhoneRotateZ(6);
    } else {
      setPhoneRotateX(4);
      setPhoneRotateY(-4);
      setPhoneRotateZ(0);
    }
  };

  const isScrollingRef = useRef(false);
  const currentFrameIndexRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  // Smooth glide to frame by index with sticky header offset (64px)
  const scrollToFrameIndex = useCallback((targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= SCREEN_FRAMES.length) return;
    const target = SCREEN_FRAMES[targetIdx];
    const el = document.getElementById(target.id);
    if (el) {
      const headerOffset = 64; // sticky header height
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
      setActiveFrameId(target.id);
      currentFrameIndexRef.current = targetIdx;
    }
  }, []);

  const scrollToFrame = useCallback((id: string) => {
    const idx = SCREEN_FRAMES.findIndex(f => f.id === id);
    if (idx !== -1) {
      scrollToFrameIndex(idx);
    }
  }, [scrollToFrameIndex]);

  // Keep currentFrameIndexRef and activeFrameId synced with scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = SCREEN_FRAMES.length - 1; i >= 0; i--) {
        const el = document.getElementById(SCREEN_FRAMES[i].id);
        if (el && el.offsetTop - 120 <= scrollPos) {
          if (currentFrameIndexRef.current !== i) {
            currentFrameIndexRef.current = i;
            setActiveFrameId(SCREEN_FRAMES[i].id);
          }
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // One-Scroll = One-Frame Glide Listener (Mouse Wheel, Touch Swipe, Keyboard)
  useEffect(() => {
    if (!snapMode) return;

    // Wheel event handler: 1 scroll down glides straight 1 frame
    const handleWheel = (e: WheelEvent) => {
      // Don't hijack if user is inside form inputs
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) {
        return;
      }

      // Filter small trackpad vibration/noise
      if (Math.abs(e.deltaY) < 18) return;

      // Prevent chaotic jumping while glide transition is running
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        // Scroll down: glide straight to next frame
        if (currentFrameIndexRef.current < SCREEN_FRAMES.length - 1) {
          e.preventDefault();
          isScrollingRef.current = true;
          const nextIdx = currentFrameIndexRef.current + 1;
          scrollToFrameIndex(nextIdx);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 720);
        }
      } else if (e.deltaY < 0) {
        // Scroll up: glide straight to previous frame
        if (currentFrameIndexRef.current > 0) {
          e.preventDefault();
          isScrollingRef.current = true;
          const prevIdx = currentFrameIndexRef.current - 1;
          scrollToFrameIndex(prevIdx);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 720);
        }
      }
    };

    // Touch event handlers for mobile & tablet screens
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null || isScrollingRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const touchEndY = e.changedTouches[0]?.clientY;
      if (touchEndY === undefined) return;
      const diff = touchStartYRef.current - touchEndY;
      touchStartYRef.current = null;

      // Threshold of 45px for deliberate swipe gesture
      if (Math.abs(diff) > 45) {
        if (diff > 0 && currentFrameIndexRef.current < SCREEN_FRAMES.length - 1) {
          // Swipe up = glide to next frame
          isScrollingRef.current = true;
          scrollToFrameIndex(currentFrameIndexRef.current + 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 680);
        } else if (diff < 0 && currentFrameIndexRef.current > 0) {
          // Swipe down = glide to prev frame
          isScrollingRef.current = true;
          scrollToFrameIndex(currentFrameIndexRef.current - 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 680);
        }
      }
    };

    // Keyboard navigation (ArrowDown, PageDown, Space = next; ArrowUp, PageUp = prev)
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (currentFrameIndexRef.current < SCREEN_FRAMES.length - 1) {
          e.preventDefault();
          scrollToFrameIndex(currentFrameIndexRef.current + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        if (currentFrameIndexRef.current > 0) {
          e.preventDefault();
          scrollToFrameIndex(currentFrameIndexRef.current - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snapMode, scrollToFrameIndex]);

  const currentFrameIndex = SCREEN_FRAMES.findIndex(f => f.id === activeFrameId);

  const handleNextFrame = () => {
    if (currentFrameIndex < SCREEN_FRAMES.length - 1) {
      scrollToFrameIndex(currentFrameIndex + 1);
    }
  };

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      scrollToFrameIndex(currentFrameIndex - 1);
    }
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    setIsClaimed(true);
    setTimeout(() => {
      onLaunchApp(handle);
    }, 800);
  };

  const copyHeroLink = () => {
    navigator.clipboard.writeText(`apy.me/${handle || 'username'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Savings calculation for interactive slider
  const traditionalFees = Math.round(previewVolume * 0.032);
  const apyFees = Math.round(previewVolume * 0.001);
  const annualSavings = (traditionalFees - apyFees) * 12;

  // FAQ data (Apy stealth Web3 terminology)
  const faqs = [
    {
      q: "How does Apy work?",
      a: "When you create an Apy link, we use stealth address technology to generate a unique address for every payment. It's like having endless private mailboxes that all deliver to you, and no one knows they're linked."
    },
    {
      q: "What is a stealth address?",
      a: "A stealth address is a one-time cryptographic destination derived from your public link using EIP-5564 protocols. The sender delivers crypto directly to this address, but only you hold the private viewing and spending key to claim the tokens into your treasury."
    },
    {
      q: "How do private payments work on Base, Ethereum & Solana?",
      a: "Apy deploys ultra-fast smart contract routers on Base (L2) and Ethereum, and ephemeral token accounts on Solana. Transactions execute in under 0.2s with zero gas fees for the sender through our relayer treasury."
    },
    {
      q: "Is Apy self-custodial?",
      a: "Yes, 100%. Apy is completely non-custodial. We never hold your private keys, seed phrases, or funds. All assets settle directly into your destination wallet under your cryptographic signature."
    },
    {
      q: "Can I receive private USDC payments?",
      a: "Yes! USDC is natively supported across Base, Arbitrum, Ethereum, Polygon, and Solana. Senders can pay in any supported token or chain, and you receive pure USDC or your preferred settlement currency."
    },
    {
      q: "How much does Apy cost?",
      a: "Creating a personal link and receiving stealth payments is 100% free. Protocol settlements have a flat 0.1% fee with zero monthly subscriptions, saving you up to 96% compared to 3.5% traditional credit card processors."
    },
    {
      q: "Does Apy have a token?",
      a: "Yes, the $APY protocol utility token powers governance, decentralized relayer staking, and settlement fee rebates. Staking $APY reduces your fee rate to 0.02%."
    },
    {
      q: "How private is Apy really?",
      a: "Outside observers, blockchain explorers (like Etherscan), and chain analysis tools cannot correlate payments made to your link with your main public wallet or with each other. Each transaction appears as an isolated, unlinked interaction."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-rose-600 selection:text-white pb-16 relative snap-y-mandatory">
      
      {/* ================= TOP FRAME PROGRESS HAIRLINE ================= */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-neutral-200/50 z-40">
        <motion.div 
          className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 shadow-xs shadow-rose-500/40"
          animate={{ width: `${((currentFrameIndex + 1) / SCREEN_FRAMES.length) * 100}%` }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
        />
      </div>

      {/* ================= 1. HERO SECTION FRAME ================= */}
      <motion.section 
        id="frame-hero"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Copy & Username Claim Form with entrance transition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            
            {/* Tagline / Eyebrow */}
            <motion.div 
              whileHover={{ scale: 1.04, y: -2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 text-xs font-mono font-medium text-neutral-800 shadow-xs cursor-default transition-colors hover:border-rose-200"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Next-Gen Web3 Settlement</span>
              <span className="text-neutral-300">•</span>
              <span className="text-rose-600 font-bold">Zero Tracking</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-950 tracking-tight leading-[1.05]">
              Get Paid <br />
              <span className="text-rose-600 relative inline-block group">
                Stay Private
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-rose-500/25 group-hover:text-rose-500/45 transition-colors" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-lg leading-relaxed">
              Everything you need to receive payments easily without exposing your wallet.
            </p>

            {/* Interactive Username Claim Input Box: apy.me/your-username + Claim My Apy */}
            <div className="pt-2 max-w-md">
              <form onSubmit={handleClaim} className="space-y-3">
                <div className="p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-sm flex items-center gap-2 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/10 hover:border-neutral-300 transition-all">
                  <span className="pl-3 text-neutral-400 font-mono font-bold text-sm select-none">
                    apy.me/
                  </span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => {
                      setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                      setIsClaimed(false);
                    }}
                    placeholder="your-username"
                    className="w-full py-2 bg-transparent text-neutral-950 font-mono font-bold text-base focus:outline-none placeholder:text-neutral-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="btn-shimmer nb-btn-primary py-3.5 px-6 rounded-xl text-sm sm:text-base font-bold tracking-wide w-full flex items-center justify-center gap-2 shadow-sm shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>LINK RESERVED! LAUNCHING...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim My Apy</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status pill under input */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-neutral-500 px-1">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Stealth meta-address ready
                </span>
                <button
                  onClick={copyHeroLink}
                  className="text-neutral-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Quick trust metrics with interactive hover scaling */}
            <div className="pt-4 flex items-center gap-6 border-t border-neutral-200/80 max-w-lg text-xs font-mono text-neutral-600">
              <div className="hover:scale-105 transition-transform cursor-default">
                <span className="font-bold text-neutral-950 text-sm">$148.2M+</span>
                <p className="text-[11px] text-neutral-400">Volume Settled</p>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="hover:scale-105 transition-transform cursor-default">
                <span className="font-bold text-emerald-600 text-sm">0.2s</span>
                <p className="text-[11px] text-neutral-400">Finality Speed</p>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="hover:scale-105 transition-transform cursor-default">
                <span className="font-bold text-rose-600 text-sm">0.1%</span>
                <p className="text-[11px] text-neutral-400">Flat Protocol Fee</p>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Ultra-Realistic 3D Hardware Smartphone Mockup with Real-time Parallax & Titanium Bevel */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center"
          >
            {/* 3D Perspective Stage Container */}
            <div className="perspective-container relative w-full max-w-[360px] mx-auto lg:mr-0 pt-4 pb-2">

              <motion.div 
                animate={{ 
                  rotateX: phoneRotateX,
                  rotateY: phoneRotateY,
                  rotateZ: phoneRotateZ,
                  y: isPhoneHovered ? -14 : 0,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                onMouseMove={handlePhoneMouseMove}
                onMouseLeave={handlePhoneMouseLeave}
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                }}
                className="relative w-full max-w-[340px] mx-auto preserve-3d cursor-grab active:cursor-grabbing select-none"
              >
                
                {/* 1. True 3D Perspective Contact & Ambient Drop Shadows */}
                <div 
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[300px] h-[80px] rounded-full pointer-events-none transition-all duration-300"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.45) 0%, rgba(225, 29, 72, 0.18) 42%, transparent 75%)',
                    transform: 'translateZ(-85px) rotateX(65deg) scale(1.15)',
                    filter: 'blur(22px)',
                  }}
                />
                <div 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[240px] h-[34px] rounded-full bg-neutral-950/40 pointer-events-none"
                  style={{
                    transform: 'translateZ(-50px) rotateX(65deg)',
                    filter: 'blur(10px)',
                  }}
                />

                {/* 2. Rear Chassis Slab (Back Extrusion Plate - 8mm Physical Thickness) */}
                <div 
                  className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 pointer-events-none"
                  style={{
                    transform: 'translateZ(-18px) translateX(-5px) translateY(4px)',
                    boxShadow: '-14px 20px 40px rgba(0, 0, 0, 0.26), -24px 36px 64px rgba(225, 29, 72, 0.14)',
                  }}
                />

                {/* 3. Physical Metallic Hardware Buttons protruding from Side Rim */}
                {/* Action Button (Left) */}
                <div 
                  className="absolute -left-2 top-24 w-1.5 h-7 rounded-l-md bg-gradient-to-b from-neutral-300 via-neutral-100 to-neutral-400 shadow-sm border-l border-white/80"
                  style={{ transform: 'translateZ(-6px)' }}
                  title="Action Button"
                />
                {/* Volume Up (Left) */}
                <div 
                  className="absolute -left-2 top-36 w-1.5 h-12 rounded-l-md bg-gradient-to-b from-neutral-300 via-neutral-100 to-neutral-400 shadow-sm border-l border-white/80"
                  style={{ transform: 'translateZ(-6px)' }}
                  title="Volume Up"
                />
                {/* Volume Down (Left) */}
                <div 
                  className="absolute -left-2 top-52 w-1.5 h-12 rounded-l-md bg-gradient-to-b from-neutral-300 via-neutral-100 to-neutral-400 shadow-sm border-l border-white/80"
                  style={{ transform: 'translateZ(-6px)' }}
                  title="Volume Down"
                />
                {/* Power / Siri Button (Right) */}
                <div 
                  className="absolute -right-2 top-36 w-1.5 h-16 rounded-r-md bg-gradient-to-b from-neutral-300 via-neutral-100 to-neutral-400 shadow-sm border-r border-white/80"
                  style={{ transform: 'translateZ(-6px)' }}
                  title="Power / Lock Button"
                />

                {/* 4. Popout 3D Layer: Top-Right Floating Stealth Shield Badge */}
                <motion.div 
                  style={{ transform: 'translateZ(42px)' }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  className="absolute -top-4 -right-4 z-40 px-3.5 py-1.5 bg-white/95 backdrop-blur-xl text-rose-600 font-mono font-bold text-[11px] rounded-full border border-rose-200 shadow-xl shadow-rose-950/20 rotate-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>STEALTH SHIELD 3D</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                </motion.div>

                {/* 5. Popout 3D Layer: Bottom-Left Floating Settlement Notification */}
                <motion.div 
                  style={{ transform: 'translateZ(36px)' }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-5 -left-5 z-40 px-3.5 py-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-emerald-200/90 shadow-xl shadow-neutral-950/20 flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    ✓
                  </div>
                  <div className="text-left font-mono">
                    <p className="text-[10px] font-bold text-neutral-900 leading-none">Stealth Encrypted</p>
                    <p className="text-[9px] text-emerald-600 font-semibold">+1,500 USDC Received</p>
                  </div>
                </motion.div>

                {/* 6. Phone Physical Front Body - Brushed Titanium Bevel Chassis */}
                <div 
                  className="relative rounded-[50px] p-3 chassis-titanium border border-white/95 shadow-2xl transition-all duration-300 hover:shadow-3xl"
                  style={{ transform: 'translateZ(0px)' }}
                >
                  
                  {/* Phone OLED Bezel - Deep Obsidian Black Rim with Speaker Earpiece */}
                  <div className="bg-neutral-950 rounded-[42px] p-2.5 shadow-inner border border-neutral-800/90 relative overflow-hidden">

                    {/* Micro Ear Speaker Grille at Top Center */}
                    <div className="w-14 h-1 bg-neutral-800 rounded-full mx-auto mb-1.5 opacity-70" />

                    {/* Phone Screen Area */}
                    <div className="bg-[#FAF9F7] rounded-[34px] overflow-hidden p-3.5 text-neutral-900 font-sans border border-neutral-200/60 relative">
                      
                      {/* Realistic Diagonal 3D Glass Surface Specular Sheen */}
                      <div 
                        className="absolute inset-0 screen-glass-sheen pointer-events-none z-30 transition-opacity duration-300"
                        style={{
                          opacity: isPhoneHovered ? 0.75 : 0.45,
                        }}
                      />

                      {/* Status Bar & Dynamic Island with Camera Glare */}
                      <div className="flex items-center justify-between text-[11px] font-mono font-medium px-2 pt-0.5 pb-2 text-neutral-500 relative z-20">
                        <span className="font-semibold text-neutral-700">9:41</span>
                        
                        {/* Interactive Dynamic Island with Optical Camera Lens Glare */}
                        <div className="w-20 h-4 bg-neutral-950 rounded-full flex items-center justify-between px-2.5 shadow-inner hover:scale-105 transition-all cursor-pointer border border-neutral-800/80">
                          {/* Front camera aperture */}
                          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-indigo-950 shadow-[0_0_2px_#6366f1]" />
                          </div>
                          {/* Sensor & Live activity dot */}
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-neutral-700">
                          <span className="text-[9px] font-bold">5G</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_4px_#10b981]" />
                        </div>
                      </div>

                      {/* Mobile Screen Header */}
                      <div className="text-center py-1 font-semibold text-xs tracking-wider text-neutral-500 font-mono uppercase relative z-20">
                        Dashboard
                      </div>

                      {/* Card 1: Your Stealth Balances with interactive hover */}
                      <div className="mt-2 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-rose-100 shadow-xs relative z-20 overflow-hidden hover:border-rose-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                          <span className="flex items-center gap-1 font-medium text-neutral-600">
                            Your Stealth Balances <Info className="w-3 h-3 text-neutral-400" />
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mb-2.5">
                          <span className="text-2xl font-black font-mono tracking-tight text-neutral-950">
                            $4,248.14
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">USD</span>
                        </div>

                        {/* Token Mini List inside balance card with interactive hover */}
                        <div className="space-y-1.5 pt-1.5 border-t border-neutral-100 text-xs">
                          <div className="flex items-center justify-between p-1.5 hover:bg-rose-50/50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                                $
                              </div>
                              <div>
                                <span className="font-semibold text-[11px] text-neutral-900">4,247.16</span>{' '}
                                <span className="text-[10px] text-neutral-400">USDC</span>
                              </div>
                            </div>
                            <Send className="w-3 h-3 text-neutral-400 rotate-45 hover:text-rose-600 transition-colors" />
                          </div>

                          <div className="flex items-center justify-between p-1.5 hover:bg-rose-50/50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                                ⚡
                              </div>
                              <div>
                                <span className="font-semibold text-[11px] text-neutral-900">0.67</span>{' '}
                                <span className="text-[10px] text-neutral-400">APY / ETH</span>
                              </div>
                            </div>
                            <Send className="w-3 h-3 text-neutral-400 rotate-45 hover:text-rose-600 transition-colors" />
                          </div>
                        </div>

                        {/* Green/Red Privacy footer pill */}
                        <div className="mt-2.5 bg-emerald-50 text-emerald-800 text-[9px] font-mono font-medium py-1 px-2 rounded-lg border border-emerald-100 text-center flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Payments received privately through Apy</span>
                        </div>
                      </div>

                      {/* Card 2: Your Personal Link */}
                      <div className="mt-2.5 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-colors relative z-20">
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                          <span>Your Personal Link</span>
                          <span className="text-neutral-400">Share to get paid</span>
                        </div>
                        <div className="flex items-center justify-between bg-neutral-50/80 p-1.5 rounded-xl border border-neutral-200/60 hover:bg-white transition-colors">
                          <span className="text-xs font-mono font-semibold text-neutral-900 truncate">
                            apy.me/{handle || 'dikta'}
                          </span>
                          <button onClick={copyHeroLink} className="p-1 hover:bg-neutral-100 rounded transition-all hover:scale-110 active:scale-95">
                            <Copy className="w-3 h-3 text-neutral-500 hover:text-rose-600" />
                          </button>
                        </div>
                      </div>

                      {/* Card 3: Activity / Transactions List */}
                      <div className="mt-2.5 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-neutral-200/80 shadow-xs relative z-20">
                        {/* Activity Filter Pills */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setPhoneTab(tab)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium capitalize transition-all active:scale-95 ${
                                  phoneTab === tab
                                    ? 'bg-neutral-900 text-white scale-105'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:scale-105'
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">Live</span>
                        </div>

                        {/* Transaction Feed */}
                        <div className="space-y-1.5 text-[11px] font-mono">
                          {(phoneTab === 'all' || phoneTab === 'incoming') && (
                            <div className="p-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50 hover:scale-[1.01] transition-all cursor-pointer">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                                  ↓
                                </div>
                                <div>
                                  <p className="font-semibold text-[10px] text-neutral-900">Received from @kelpin</p>
                                  <span className="text-[8px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-600">personal</span>
                                </div>
                              </div>
                              <span className="font-bold text-emerald-700 text-[11px]">+1,500 USDC</span>
                            </div>
                          )}

                          {(phoneTab === 'all' || phoneTab === 'outgoing') && (
                            <div className="p-1.5 rounded-xl bg-neutral-50/80 border border-neutral-200/60 flex items-center justify-between hover:bg-neutral-100 hover:scale-[1.01] transition-all cursor-pointer">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[9px] font-bold">
                                  ↑
                                </div>
                                <div>
                                  <p className="font-semibold text-[10px] text-neutral-900">Sent to @kelpin</p>
                                  <span className="text-[8px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-600">payout</span>
                                </div>
                              </div>
                              <span className="font-bold text-neutral-800 text-[11px]">-1,500 USDC</span>
                            </div>
                          )}

                          {(phoneTab === 'all' || phoneTab === 'incoming') && (
                            <div className="p-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50 hover:scale-[1.01] transition-all cursor-pointer">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                                  ↓
                                </div>
                                <div>
                                  <p className="font-semibold text-[10px] text-neutral-900">Received from 0x4a7...</p>
                                  <span className="text-[8px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-600">stealth</span>
                                </div>
                              </div>
                              <span className="font-bold text-emerald-700 text-[11px]">+200 USDC</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Bottom Nav Bar with interactive hover icons */}
                      <div className="mt-3 py-1.5 px-4 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200/80 shadow-xs flex items-center justify-between text-neutral-500 relative z-20">
                        <button className="p-1 text-rose-600 hover:scale-125 transition-transform cursor-pointer">
                          <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                            <span className="text-xs">⚡</span>
                          </div>
                        </button>
                        <button className="p-1 hover:text-neutral-950 hover:scale-125 transition-transform cursor-pointer">
                          <Wallet className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-neutral-950 hover:scale-125 transition-transform cursor-pointer">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-neutral-950 hover:scale-125 transition-transform cursor-pointer">
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Sub text under mobile */}
                      <div className="text-center pt-1 text-[9px] font-mono text-neutral-400 relative z-20">
                        apy.me protocol client
                      </div>

                    </div>
                  </div>

                </div>

              </motion.div>

              {/* 7. 3D Angle Presets Toolbar & Real-time Parallax Controller */}
              <div className="mt-6 flex flex-col items-center gap-2 relative z-30">
                <div className="inline-flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-full border border-neutral-200 shadow-xs text-xs font-mono">
                  <button
                    onClick={() => switch3DMode('isometric')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      view3DMode === 'isometric' 
                        ? 'bg-neutral-900 text-white shadow-xs' 
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    Isometric 3D
                  </button>
                  <button
                    onClick={() => switch3DMode('dramatic')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      view3DMode === 'dramatic' 
                        ? 'bg-neutral-900 text-white shadow-xs' 
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    Dramatic 3D
                  </button>
                  <button
                    onClick={() => switch3DMode('front')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      view3DMode === 'front' 
                        ? 'bg-neutral-900 text-white shadow-xs' 
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    Front View
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                  <MousePointerClick className="w-3 h-3 text-rose-500 animate-bounce" />
                  <span>Move cursor over phone for real-time 3D tilt & parallax</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Frame 01 Bottom Cue to Glide to Frame 02 */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Frame 02: Core Pillars</span>
            <ChevronDown className="w-3.5 h-3.5 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ================= 2. VALUE PROPOSITION PILLARS FRAME ================= */}
      <motion.section 
        id="frame-pillars"
        initial={{ opacity: 0, y: 45, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 py-12 px-4 sm:px-8 max-w-5xl mx-auto text-center"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-sm space-y-6 hover:shadow-md transition-shadow">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight"
          >
            Fixing things Web3 payments got wrong.
          </motion.h2>

          {/* Three Iconic Pills with Staggered Entrance and Interactive Hover */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
            
            {/* Pill 1: Private (Blue) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-blue-700 flex items-center gap-2 font-mono font-bold text-sm sm:text-base shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <span className="text-lg">🥷</span>
              <span>Private</span>
            </motion.div>

            {/* Pill 2: Seamless (Mint Green) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 rounded-full bg-emerald-50/80 border border-emerald-200/70 text-emerald-700 flex items-center gap-2 font-mono font-bold text-sm sm:text-base shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
            >
              <span className="text-lg">☁️</span>
              <span>Seamless</span>
            </motion.div>

            {/* Pill 3: Self-custodial (Rose/Pink) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 rounded-full bg-rose-50/80 border border-rose-200/70 text-rose-600 flex items-center gap-2 font-mono font-bold text-sm sm:text-base shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
            >
              <span className="text-lg">🌸</span>
              <span>Self-custodial</span>
            </motion.div>

          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-base sm:text-lg font-normal text-neutral-500 font-sans"
          >
            This is crypto payments done right.
          </motion.p>

        </div>

        {/* Frame 02 Bottom Cue to Glide to Frame 03 */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(2)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Frame 03: Merchant Interface & Bento</span>
            <ChevronDown className="w-3.5 h-3.5 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ================= 3. TRIPLE DEVICE SHOWCASE & 6 BENTO CARDS GRID FRAME ================= */}
      <motion.section 
        id="frame-showcase"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        
        {/* Top: 3-Phone Screen Interface Showcase */}
        <div className="mb-14 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4 }}
            className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200 font-mono text-xs font-semibold text-neutral-700 uppercase mb-4 shadow-xs"
          >
            Unified Merchant Interface
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-8"
          >
            Engineered for total financial sovereignty.
          </motion.h2>

          {/* 3 Devices Mockup Flexbox with interactive hover and click */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* Phone 1: Setup Link */}
            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveScreenIndex(0)}
              className={`w-full max-w-[260px] bg-white/85 backdrop-blur-md rounded-[34px] p-3 border transition-all cursor-pointer ${
                activeScreenIndex === 0 
                  ? 'border-rose-400 shadow-md ring-2 ring-rose-500/20 scale-105' 
                  : 'border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div className="bg-[#FAF9F7] rounded-[26px] p-4 text-center min-h-[350px] flex flex-col items-center justify-between border border-neutral-200/60">
                <div className="w-12 h-2.5 bg-neutral-900 rounded-full mx-auto" />
                
                {/* Mascots illustration */}
                <div className="my-auto space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center text-2xl font-black mx-auto shadow-sm shadow-rose-500/30 group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <div className="font-black text-base text-neutral-950 leading-tight">
                    Get Paid <br />
                    <span className="text-rose-600">Stay Private</span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Your personal Web3 payment link with stealth address masking.
                  </p>
                </div>

                <div className="w-full py-2 bg-neutral-900 text-white rounded-xl text-[11px] font-mono font-bold hover:bg-neutral-800 transition-colors">
                  apy.me
                </div>
              </div>
              <p className="text-center text-xs font-mono font-semibold text-neutral-500 mt-2.5">01. Setup Link</p>
            </motion.div>

            {/* Phone 2: Active Dashboard with $290.98 USD */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveScreenIndex(1)}
              className={`w-full max-w-[270px] bg-white/90 backdrop-blur-md rounded-[34px] p-3 border transition-all cursor-pointer ${
                activeScreenIndex === 1 
                  ? 'border-rose-400 shadow-md ring-2 ring-rose-500/20 scale-105 z-10' 
                  : 'border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div className="bg-[#FAF9F7] rounded-[26px] p-4 min-h-[350px] flex flex-col justify-between border border-neutral-200/60 text-left">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-medium mb-2 text-neutral-500">
                    <span>9:41</span>
                    <span className="text-neutral-800 font-bold">bangjago.eth</span>
                    <span>...</span>
                  </div>

                  <div className="bg-white/95 rounded-2xl p-3 border border-neutral-200/80 shadow-xs mb-2.5 hover:border-rose-200 transition-colors">
                    <span className="text-[10px] font-mono text-neutral-400">Your Stealth Balance</span>
                    <div className="text-xl font-black font-mono text-neutral-950">$290.98 <span className="text-[10px] text-neutral-400">USD</span></div>
                    
                    <div className="mt-2 space-y-1 text-[10px] font-mono text-neutral-600">
                      <div className="flex justify-between hover:text-neutral-900 transition-colors">
                        <span>USDC</span>
                        <span className="font-bold text-neutral-900">199 USDC ↗</span>
                      </div>
                      <div className="flex justify-between hover:text-neutral-900 transition-colors">
                        <span>Solana</span>
                        <span className="font-bold text-neutral-900">0.312 SOL ↗</span>
                      </div>
                      <div className="flex justify-between hover:text-neutral-900 transition-colors">
                        <span>Base / APY</span>
                        <span className="font-bold text-neutral-900">0.188 APY ↗</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-neutral-400 mb-1 flex justify-between">
                    <span>Activities</span>
                    <span className="text-rose-600 font-bold hover:underline cursor-pointer">See All</span>
                  </div>
                  <div className="space-y-1">
                    <div className="p-1.5 bg-emerald-50/80 rounded-lg text-[9px] font-mono flex justify-between border border-emerald-100 hover:bg-emerald-100/70 transition-colors">
                      <span>Received from @design</span>
                      <span className="font-bold text-emerald-700">+20 USDC</span>
                    </div>
                    <div className="p-1.5 bg-emerald-50/80 rounded-lg text-[9px] font-mono flex justify-between border border-emerald-100 hover:bg-emerald-100/70 transition-colors">
                      <span>Received from @design</span>
                      <span className="font-bold text-emerald-700">+20 USDC</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] font-mono text-emerald-700 font-semibold pt-2">
                  ✓ 100% Non-Custodial Vault
                </div>
              </div>
              <p className="text-center text-xs font-mono font-bold text-neutral-900 mt-2.5">02. Stealth Vault</p>
            </motion.div>

            {/* Phone 3: Settlement Notification */}
            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveScreenIndex(2)}
              className={`w-full max-w-[260px] bg-white/85 backdrop-blur-md rounded-[34px] p-3 border transition-all cursor-pointer ${
                activeScreenIndex === 2 
                  ? 'border-rose-400 shadow-md ring-2 ring-rose-500/20 scale-105' 
                  : 'border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div className="bg-[#FAF9F7] rounded-[26px] p-4 text-center min-h-[350px] flex flex-col justify-between border border-neutral-200/60">
                <div className="flex items-center justify-between text-[10px] font-mono font-medium text-neutral-500">
                  <span>9:41</span>
                  <span>Activity Log</span>
                  <span>📶</span>
                </div>

                <div className="my-auto space-y-2.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  
                  <div>
                    <div className="text-2xl font-black font-mono text-emerald-700">+ $100</div>
                    <div className="text-xs font-mono font-bold text-neutral-600">100 USDC SETTLED</div>
                  </div>

                  <div className="p-2 bg-white/90 rounded-xl border border-neutral-200 text-[10px] font-mono text-neutral-600 hover:border-neutral-300 transition-colors">
                    <p className="font-semibold text-neutral-800">EIP-712 Receipt</p>
                    <p className="text-neutral-400 truncate">0x9a3f...d88c</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-400">
                  Instant webhook triggered
                </div>
              </div>
              <p className="text-center text-xs font-mono font-semibold text-neutral-500 mt-2.5">03. Proof Receipt</p>
            </motion.div>

          </div>
        </div>

        {/* BOTTOM: 6 Bento Cards Grid - Minimalist Glass Cards with interactive hover & staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* 1. Create */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Create
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Craft payment links for any purpose, fresh address on every payment.
            </p>
          </motion.div>

          {/* 2. Receive */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Receive
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Accept payments privately without exposing your main wallet.
            </p>
          </motion.div>

          {/* 3. Self-Custody */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Self-Custody
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Full control of your funds, we never touch your keys.
            </p>
          </motion.div>

          {/* 4. Track */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <ListOrdered className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Track
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              All your payment data organized and accessible.
            </p>
          </motion.div>

          {/* 5. Cross-chain */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Cross-chain
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              USDC from 10+ chains, settle on Base, Ethereum or Solana.
            </p>
          </motion.div>

          {/* 6. Sell */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-interactive bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:border-rose-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">
              Sell
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Share digital products with automatic delivery after payment.
            </p>
          </motion.div>

        </div>

        {/* Frame 03 Bottom Cue to Glide to Frame 04 */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(3)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Frame 04: Savings Calculator</span>
            <ChevronDown className="w-3.5 h-3.5 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ================= 4. INTERACTIVE SAVINGS CALCULATOR FRAME ================= */}
      <motion.section 
        id="frame-calculator"
        initial={{ opacity: 0, y: 45, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 py-12 px-4 sm:px-8 max-w-5xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                Financial Impact Calculator
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mt-1">
                Calculate your fee savings vs Stripe & PayPal
              </h3>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-200/80 text-right"
            >
              <span className="text-[11px] font-mono text-emerald-800 font-semibold uppercase">Estimated Annual Savings</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
                +${annualSavings.toLocaleString()}
              </div>
            </motion.div>
          </div>

          <div className="pt-6 space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                <span className="text-neutral-600">MONTHLY SETTLEMENT VOLUME</span>
                <span className="text-base text-neutral-950 font-black">${previewVolume.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="2000"
                max="250000"
                step="1000"
                value={previewVolume}
                onChange={(e) => setPreviewVolume(parseInt(e.target.value))}
                className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-1.5">
                <span>$2,000</span>
                <span>$100,000</span>
                <span>$250,000+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 hover:border-rose-200 transition-all shadow-xs"
              >
                <div className="text-xs font-mono text-neutral-500 font-semibold uppercase">Legacy Credit Cards (~3.2%)</div>
                <div className="text-2xl font-black font-mono text-rose-600 mt-1">
                  -${traditionalFees.toLocaleString()} / mo
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 font-mono">
                  Includes 3.5% interchange fees, chargebacks & 14-day rolling holds.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-200 transition-all shadow-xs"
              >
                <div className="text-xs font-mono text-neutral-500 font-semibold uppercase">Apy Protocol (0.1% Flat)</div>
                <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                  -${apyFees.toLocaleString()} / mo
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 font-mono">
                  Instant settlement on Base L2 & Solana. 0% chargebacks, non-custodial.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Frame 04 Bottom Cue to Glide to Frame 05 */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(4)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Frame 05: Apy It Up! Banner</span>
            <ChevronDown className="w-3.5 h-3.5 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ================= 5. BANNER: "APY IT UP!" FRAME ================= */}
      <motion.section 
        id="frame-banner"
        initial={{ opacity: 0, y: 55, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-rose-50/40 backdrop-blur-xl rounded-[36px] border border-rose-100 shadow-sm p-8 sm:p-16 text-center relative overflow-hidden">
          
          {/* Top Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight leading-tight max-w-3xl mx-auto"
          >
            If you scrolled this far, <br />
            It's time for you to{' '}
            <span className="text-rose-600 uppercase tracking-tight">
              APY IT UP!
            </span>
          </motion.h2>

          {/* CTA Button with interactive shimmer and hover pop */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 mb-12"
          >
            <button
              onClick={() => onLaunchApp(handle)}
              className="btn-shimmer px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-base tracking-wide shadow-md shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create Your Link</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Mascots & Merchant Handles with spring hover */}
          <div className="relative pt-6 max-w-4xl mx-auto">
            
            {/* Mascot Characters with playful spring physics */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 relative z-10">
              
              {/* Pink Cute Star */}
              <motion.div 
                initial={{ opacity: 0, y: 30, rotate: -15 }}
                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                viewport={{ once: false }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.1 }}
                whileHover={{ scale: 1.2, rotate: 0, y: -6 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500 text-white border border-rose-300 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md cursor-pointer"
              >
                <span className="text-xl">🌸</span>
                <span className="text-[9px] font-mono font-bold">stealth</span>
              </motion.div>

              {/* Yellow Star with Sunglasses */}
              <motion.div 
                initial={{ opacity: 0, y: 35, rotate: -8 }}
                whileInView={{ opacity: 1, y: -8, rotate: 0 }}
                viewport={{ once: false }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.2 }}
                whileHover={{ scale: 1.2, rotate: 0, y: -12 }}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-400 text-neutral-950 border border-amber-300 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md cursor-pointer"
              >
                <span className="text-2xl">😎</span>
                <span className="text-[9px] font-mono font-bold">0% fees</span>
              </motion.div>

              {/* Mint smiling cloud */}
              <motion.div 
                initial={{ opacity: 0, y: 30, rotate: 12 }}
                whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                viewport={{ once: false }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.3 }}
                whileHover={{ scale: 1.2, rotate: 0, y: -6 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-400 text-neutral-950 border border-emerald-300 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md cursor-pointer"
              >
                <span className="text-xl">☁️</span>
                <span className="text-[9px] font-mono font-bold">instant</span>
              </motion.div>

              {/* Crimson Red mascot */}
              <motion.div 
                initial={{ opacity: 0, y: 30, rotate: 20 }}
                whileInView={{ opacity: 1, y: 0, rotate: 12 }}
                viewport={{ once: false }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.4 }}
                whileHover={{ scale: 1.2, rotate: 0, y: -6 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-600 text-white border border-rose-400 shadow-sm flex flex-col items-center justify-center transition-shadow hover:shadow-md cursor-pointer"
              >
                <span className="text-xl">⚡</span>
                <span className="text-[9px] font-mono font-bold">APY</span>
              </motion.div>

            </div>

            {/* Floating Handle Pills with interactive hover */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-mono"
            >
              
              <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 text-neutral-500 flex items-center gap-2 shadow-2xs hover:border-neutral-300 hover:scale-105 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>0x9A12...C3dA</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xs font-semibold text-neutral-900 flex items-center gap-1.5 hover:border-rose-200 hover:scale-105 transition-all cursor-default">
                <span>💻</span>
                <span className="text-rose-600">apy.me / alex</span>
                <span className="text-neutral-400 font-normal">• software engineer</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 text-neutral-500 flex items-center gap-2 shadow-2xs hover:border-neutral-300 hover:scale-105 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>0x4B08...D2dB</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xs font-semibold text-neutral-900 flex items-center gap-1.5 hover:border-rose-200 hover:scale-105 transition-all cursor-default">
                <span>✏️</span>
                <span className="text-rose-600">apy.me / morgan</span>
                <span className="text-neutral-400 font-normal">• UX designer</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 text-neutral-500 flex items-center gap-2 shadow-2xs hover:border-neutral-300 hover:scale-105 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>0x7F45...B1e6</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xs font-semibold text-neutral-900 flex items-center gap-1.5 hover:border-rose-200 hover:scale-105 transition-all cursor-default">
                <span>📊</span>
                <span className="text-rose-600">apy.me / taylor</span>
                <span className="text-neutral-400 font-normal">• product manager</span>
              </div>

            </motion.div>

          </div>

        </div>

        {/* Frame 05 Bottom Cue to Glide to Frame 06 */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(5)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Frame 06: Protocol FAQs & Technical Specs</span>
            <ChevronDown className="w-3.5 h-3.5 text-rose-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ================= 6. FREQUENTLY ASKED QUESTIONS FRAME ================= */}
      <motion.section 
        id="frame-faq"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center snap-frame-slide relative scroll-mt-16 py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & Subtitle */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-4"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-600 font-normal leading-relaxed">
              Everything you need to know about stealth address payments, zero-chargeback crypto settlement, and decentralized wallet privacy.
            </p>

            <div className="pt-4">
              <div className="p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 hover:border-rose-200 transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600">
                  <span>⚡</span>
                  <span>PROTOCOL SUPPORT</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Need custom merchant contracts, WooCommerce plugins, or high-volume enterprise routing?
                </p>
                <button
                  onClick={() => onLaunchApp(handle)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-rose-600 text-white rounded-xl text-xs font-mono font-semibold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
                >
                  Contact Protocol Engineering
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Accordion Items with interactive hover & staggered reveal */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isOpen 
                      ? 'bg-white/95 backdrop-blur-md border-rose-200 shadow-sm p-6' 
                      : 'bg-white/80 backdrop-blur-md border-neutral-200/80 hover:border-rose-200 hover:shadow-xs p-5 hover:translate-x-1'
                  }`}
                  onClick={() => toggleFaq(idx)}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
                      {faq.q}
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-200 ${
                      isOpen ? 'bg-rose-500 text-white rotate-180 scale-105' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 pt-3 border-t border-neutral-100 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans overflow-hidden"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Frame 06 Bottom: Return to Top Frame 01 */}
        <div className="pt-10 flex justify-center">
          <button
            onClick={() => scrollToFrameIndex(0)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white border border-neutral-200/90 text-xs font-mono font-semibold text-neutral-700 hover:text-neutral-950 shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <ChevronUp className="w-4 h-4 text-rose-600 group-hover:-translate-y-0.5 transition-transform" />
            <span>Return to Frame 01: Hero</span>
          </button>
        </div>
      </motion.section>

      {/* ================= FLOATING SCREEN FRAME NAVIGATOR HUD ================= */}
      {/* Desktop Vertical Frame Pill Dock */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5">
        
        {/* Snap Mode Status & Toggle Pill */}
        <button
          onClick={() => setSnapMode(!snapMode)}
          title={snapMode ? "1 Scroll = 1 Frame Glide is ACTIVE. Click to switch to free scroll" : "Free Scroll is active. Click to enable 1 Scroll = 1 Frame Glide"}
          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            snapMode 
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:scale-105' 
              : 'bg-white/90 text-neutral-500 border border-neutral-200 hover:bg-neutral-100 hover:scale-105'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${snapMode ? 'bg-rose-600 animate-ping' : 'bg-neutral-400'}`} />
          <span>{snapMode ? '1 Scroll = 1 Frame' : 'Free Scroll'}</span>
        </button>

        <div className="bg-white/95 backdrop-blur-xl p-2 rounded-2xl border border-neutral-200/90 shadow-xl flex flex-col items-center gap-1.5">
          {/* Scroll Up Button */}
          <button
            onClick={handlePrevFrame}
            disabled={currentFrameIndex === 0}
            title="Previous Screen Frame (Up Arrow / PageUp)"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Dots List */}
          <div className="flex flex-col items-center gap-2 py-1.5">
            {SCREEN_FRAMES.map((frame, idx) => {
              const isActive = activeFrameId === frame.id;
              return (
                <button
                  key={frame.id}
                  onClick={() => scrollToFrameIndex(idx)}
                  title={`${frame.num}. ${frame.title} - ${frame.subtitle}`}
                  className="group relative flex items-center justify-center p-1 cursor-pointer"
                >
                  {/* Outer Active Ring */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFrameRing"
                      className="absolute inset-0 rounded-full border-2 border-rose-500 scale-125"
                      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-rose-600 scale-110' 
                        : 'bg-neutral-300 group-hover:bg-neutral-500 group-hover:scale-125'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute right-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 text-white text-[11px] font-mono py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">{frame.num}</span>
                    <span>{frame.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scroll Down Button */}
          <button
            onClick={handleNextFrame}
            disabled={currentFrameIndex === SCREEN_FRAMES.length - 1}
            title="Next Screen Frame (Down Arrow / PageDown)"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Active Screen Frame Label Pill */}
        <div className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-neutral-200/90 shadow-sm text-[10px] font-mono font-bold text-neutral-700 flex items-center gap-1">
          <span className="text-rose-600">{SCREEN_FRAMES[currentFrameIndex]?.num}</span>
          <span className="text-neutral-300">/</span>
          <span>06</span>
          <span className="text-neutral-400 font-normal ml-0.5">• {SCREEN_FRAMES[currentFrameIndex]?.title}</span>
        </div>
      </div>

      {/* Mobile/Tablet Floating Screen Frame Pill HUD (Bottom Right) */}
      <div className="xl:hidden fixed bottom-6 right-4 z-40">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-neutral-200/90 shadow-lg flex items-center gap-2.5 text-xs font-mono"
        >
          <button
            onClick={handlePrevFrame}
            disabled={currentFrameIndex === 0}
            className="p-1 text-neutral-500 hover:text-neutral-950 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          
          <span className="font-bold text-neutral-900 flex items-center gap-1">
            <span className="text-rose-600">{SCREEN_FRAMES[currentFrameIndex]?.num}</span>
            <span className="text-neutral-400">/</span>
            <span>06</span>
          </span>

          <span className="text-[11px] text-neutral-600 font-medium hidden sm:inline">
            {SCREEN_FRAMES[currentFrameIndex]?.title}
          </span>

          <button
            onClick={handleNextFrame}
            disabled={currentFrameIndex === SCREEN_FRAMES.length - 1}
            className="p-1 text-neutral-500 hover:text-neutral-950 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

    </div>
  );
}
