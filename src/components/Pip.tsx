'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface PipProps {
  size?: number;
  className?: string;
  animateBook?: boolean;
  wave?: boolean;
}

export function Pip({ size = 80, className = '', animateBook = false, wave = false }: PipProps) {
  const shouldReduceMotion = useReducedMotion();
  const doAnimate = animateBook && !shouldReduceMotion;
  const doWave = wave && !shouldReduceMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <circle cx="50" cy="55" r="35" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3" />
      {/* Ear tufts */}
      <path d="M 25 35 Q 20 15 35 25" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 75 35 Q 80 15 65 25" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Eyes */}
      <circle cx="38" cy="45" r="8" fill="#FFF" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="62" cy="45" r="8" fill="#FFF" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="38" cy="45" r="3" fill="var(--ink)" />
      <circle cx="62" cy="45" r="3" fill="var(--ink)" />
      {/* Highlight dots */}
      <circle cx="39" cy="44" r="1" fill="#FFF" />
      <circle cx="63" cy="44" r="1" fill="#FFF" />
      {/* Beak */}
      <polygon points="47,52 53,52 50,58" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Left Wing */}
      {doWave ? (
        <motion.path
          d="M 18 55 Q 5 65 15 75 Q 25 75 22 65"
          fill="var(--cream)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ originX: '18px', originY: '55px' }}
          animate={{ rotate: [0, -20, 0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      ) : (
        <path d="M 18 55 Q 5 65 15 75 Q 25 75 22 65" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      )}
      {/* Right Wing */}
      <path d="M 82 55 Q 95 65 85 75 Q 75 75 78 65" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      {/* Book */}
      <g transform="translate(35, 65)">
        <path d="M 0 5 L 15 10 L 30 5 L 30 20 L 15 25 L 0 20 Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 15 10 L 15 25" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        {doAnimate ? (
          <motion.path d="M 2 8 L 13 12" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }} />
        ) : (
          <path d="M 2 8 L 13 12" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        )}
        {doAnimate ? (
          <motion.path d="M 17 12 L 28 8" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut', delay: 0.1 }} />
        ) : (
          <path d="M 17 12 L 28 8" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
