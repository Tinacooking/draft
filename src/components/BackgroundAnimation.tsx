import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function BackgroundAnimation() {
  // Smooth mouse tracking with spring physics
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating particles representation
  const particles = [
    { id: 1, text: '✦', x: '12%', y: '18%', duration: 18, delay: 0, size: 'text-sm' },
    { id: 2, text: '0x', x: '82%', y: '15%', duration: 22, delay: 2, size: 'text-xs font-mono' },
    { id: 3, text: '⬡', x: '25%', y: '70%', duration: 20, delay: 4, size: 'text-base' },
    { id: 4, text: '•', x: '75%', y: '65%', duration: 16, delay: 1, size: 'text-lg' },
    { id: 5, text: '✦', x: '45%', y: '85%', duration: 24, delay: 3, size: 'text-xs' },
    { id: 6, text: 'eip5564', x: '88%', y: '45%', duration: 26, delay: 5, size: 'text-[10px] font-mono' },
    { id: 7, text: '◈', x: '8%', y: '50%', duration: 19, delay: 2.5, size: 'text-sm' },
    { id: 8, text: '•', x: '60%', y: '25%', duration: 15, delay: 1.5, size: 'text-base' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      
      {/* 1. Subtle Dot-Matrix Grid with Radial Mask */}
      <div 
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 40%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 40%, black 40%, transparent 80%)',
        }}
      />

      {/* 2. Interactive Mouse Cursor Spotlight Glow */}
      {mounted && (
        <motion.div
          className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            x: smoothX,
            y: smoothY,
            background: 'radial-gradient(circle, rgba(225, 29, 72, 0.07) 0%, rgba(244, 63, 94, 0.03) 40%, transparent 70%)',
          }}
        />
      )}

      {/* 3. Floating Organic Gradient Blobs */}
      {/* Blob 1: Rose / Coral Top-Right Glow */}
      <motion.div
        className="absolute -top-[10%] -right-[5%] w-[550px] h-[550px] rounded-full filter blur-[90px] opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.16) 0%, rgba(251, 113, 133, 0.08) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2: Warm Amber / Sunset Glow (Mid-Left) */}
      <motion.div
        className="absolute top-[35%] -left-[10%] w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, 50, -20, 0],
          y: [0, 40, -40, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Blob 3: Ethereal Violet / Indigo Glow (Bottom-Right) */}
      <motion.div
        className="absolute -bottom-[15%] right-[15%] w-[600px] h-[600px] rounded-full filter blur-[110px] opacity-55"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, -40, 40, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Blob 4: Soft Emerald / Cyan Whisper (Center-Bottom) */}
      <motion.div
        className="absolute bottom-[20%] -left-[5%] w-[420px] h-[420px] rounded-full filter blur-[95px] opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />

      {/* 4. Animated Cryptographic Web3 Micro-Glyphs */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute text-rose-500/35 select-none ${p.size}`}
          style={{ left: p.x, top: p.y }}
          animate={{
            y: ['0px', '-24px', '0px'],
            opacity: [0.15, 0.5, 0.15],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        >
          {p.text}
        </motion.div>
      ))}

      {/* 5. Subtle Luminous Curvature Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-100,200 C300,100 600,350 1200,150 C1500,50 1800,280 2200,180"
          fill="none"
          stroke="url(#curve-gradient)"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <path
          d="M-100,500 C400,650 800,450 1300,620 C1700,750 2000,500 2400,600"
          fill="none"
          stroke="url(#curve-gradient)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      </svg>

    </div>
  );
}
